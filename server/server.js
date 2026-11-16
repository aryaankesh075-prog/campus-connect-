const express = require('express')
const path = require('path')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('./db')
require('./seed')()

const PORT = process.env.PORT || 3000
const IS_PROD = process.env.NODE_ENV === 'production'
let JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  if (IS_PROD) throw new Error('JWT_SECRET must be set in production')
  JWT_SECRET = 'dev-only-secret-change-me'
  console.warn('⚠ JWT_SECRET not set – using an insecure development secret.')
}

const app = express()
app.use(express.json({ limit: '100kb' }))
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  next()
})

/* ------------------------------------------------------------------ helpers */
class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
const wrap = (fn) => (req, res, next) => {
  try {
    const out = fn(req, res)
    if (out && out.catch) out.catch(next)
  } catch (e) {
    next(e)
  }
}
const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const signToken = (role, id) => jwt.sign({ role, id }, JWT_SECRET, { expiresIn: '7d' })

// very small in-memory rate limiter (per IP + route) for auth endpoints
const hits = new Map()
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const key = req.ip + req.path
    const now = Date.now()
    const entry = (hits.get(key) || []).filter((t) => now - t < windowMs)
    if (entry.length >= max) return next(new HttpError(429, 'Too many attempts. Please try again in a few minutes.'))
    entry.push(now)
    hits.set(key, entry)
    next()
  }
}
const authLimiter = rateLimit(15, 10 * 60 * 1000)

function auth(role) {
  return (req, res, next) => {
    const header = req.get('authorization') || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next(new HttpError(401, 'Please log in to continue.'))
    try {
      const p = jwt.verify(token, JWT_SECRET)
      if (role && p.role !== role) return next(new HttpError(403, 'You do not have access to this resource.'))
      req.auth = p
      if (p.role === 'student') {
        req.student = db.prepare('SELECT * FROM students WHERE id = ?').get(p.id)
        if (!req.student) return next(new HttpError(401, 'Account no longer exists.'))
      } else {
        req.admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(p.id)
        if (!req.admin) return next(new HttpError(401, 'Account no longer exists.'))
      }
      next()
    } catch {
      next(new HttpError(401, 'Your session has expired. Please log in again.'))
    }
  }
}
// attaches the student if a valid token is present, otherwise continues anonymously
function optionalAuth(req, res, next) {
  const header = req.get('authorization') || ''
  if (header.startsWith('Bearer ')) {
    try {
      req.auth = jwt.verify(header.slice(7), JWT_SECRET)
    } catch {}
  }
  next()
}

const eventOut = (r) => ({
  id: String(r.id),
  title: r.title,
  slug: r.slug,
  description: r.description,
  category: r.category,
  status: r.status,
  startDate: r.start_date,
  endDate: r.end_date,
  registrationDeadline: r.registration_deadline,
  venue: r.venue,
  organiser: r.organiser,
  coordinatorName: r.coordinator_name,
  coordinatorEmail: r.coordinator_email,
  maxParticipants: r.max_participants,
  availableSeats: r.available_seats,
  fee: r.fee,
  eligibility: r.eligibility,
  rules: r.rules,
  featured: !!r.featured,
  image: r.image,
  imageAlt: r.image_alt || r.title,
})
const studentOut = (s) => ({
  id: s.id,
  enrollment: s.enrollment,
  name: s.name,
  email: s.email,
  phone: s.phone,
  department: s.department,
  year: s.year,
  interests: JSON.parse(s.interests || '[]'),
  verified: !!s.verified,
})

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshops', 'Hackathons', 'Seminars', 'Competitions', 'Festivals']
const STATUSES = ['draft', 'published', 'closed', 'completed']

/* --------------------------------------------------------------------- auth */
// Student login: college ID and/or college email + password
app.post('/api/auth/student/login', authLimiter, wrap((req, res) => {
  const enrollment = str(req.body.enrollment, 40).toUpperCase()
  const email = str(req.body.email, 120).toLowerCase()
  const password = str(req.body.password, 200)
  if (!password || (!enrollment && !email)) throw new HttpError(400, 'Enter your college ID or email, and your password.')
  const s = enrollment
    ? db.prepare('SELECT * FROM students WHERE enrollment = ?').get(enrollment)
    : db.prepare('SELECT * FROM students WHERE email = ?').get(email)
  const ok = s && s.password_hash && bcrypt.compareSync(password, s.password_hash) && (!enrollment || !email || s.email === email)
  if (!ok) throw new HttpError(401, 'Invalid credentials. If you are new, verify your college ID first.')
  if (!s.verified) throw new HttpError(403, 'Please verify your college ID first.')
  res.json({ token: signToken('student', s.id), user: studentOut(s) })
}))

app.post('/api/auth/admin/login', authLimiter, wrap((req, res) => {
  const email = str(req.body.email, 120).toLowerCase()
  const password = str(req.body.password, 200)
  const a = db.prepare('SELECT * FROM admins WHERE email = ?').get(email)
  if (!a || !bcrypt.compareSync(password, a.password_hash)) throw new HttpError(401, 'Invalid admin credentials.')
  res.json({ token: signToken('admin', a.id), user: { id: a.id, name: a.name, email: a.email } })
}))

// Verify college ID (step 1): match enrollment + email against the eligible-student list and issue an OTP
app.post('/api/auth/otp/send', authLimiter, wrap((req, res) => {
  const enrollment = str(req.body.enrollment, 40).toUpperCase()
  const email = str(req.body.email, 120).toLowerCase()
  const s = db.prepare('SELECT * FROM students WHERE enrollment = ? AND email = ?').get(enrollment, email)
  if (!s) throw new HttpError(404, 'We could not match these details to an eligible student record.')
  if (s.verified && s.password_hash) throw new HttpError(409, 'This account is already verified. Please log in.')
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0')
  db.prepare('INSERT OR REPLACE INTO otps (student_id, code_hash, expires_at, attempts) VALUES (?,?,?,0)').run(
    s.id,
    bcrypt.hashSync(code, 8),
    Date.now() + 10 * 60 * 1000,
  )
  // TODO: send `code` to s.email with your mail provider (e.g. nodemailer). Logged for development only.
  console.log(`[OTP] ${s.email}: ${code}`)
  const masked = s.email[0] + '••••' + s.email.slice(s.email.indexOf('@'))
  res.json({ sent: true, maskedEmail: masked, ...(IS_PROD ? {} : { devOtp: code }) })
}))

// Verify college ID (step 2): check the OTP, set a password, activate the account
app.post('/api/auth/otp/verify', authLimiter, wrap((req, res) => {
  const enrollment = str(req.body.enrollment, 40).toUpperCase()
  const email = str(req.body.email, 120).toLowerCase()
  const code = str(req.body.otp, 10)
  const password = str(req.body.password, 200)
  if (password.length < 8) throw new HttpError(400, 'Choose a password with at least 8 characters.')
  const s = db.prepare('SELECT * FROM students WHERE enrollment = ? AND email = ?').get(enrollment, email)
  const o = s && db.prepare('SELECT * FROM otps WHERE student_id = ?').get(s.id)
  if (!o || o.expires_at < Date.now()) throw new HttpError(400, 'Code expired. Please request a new one.')
  if (o.attempts >= 5) throw new HttpError(429, 'Too many wrong codes. Please request a new one.')
  if (!bcrypt.compareSync(code, o.code_hash)) {
    db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE student_id = ?').run(s.id)
    throw new HttpError(400, 'Incorrect code.')
  }
  db.prepare('UPDATE students SET password_hash = ?, verified = 1 WHERE id = ?').run(bcrypt.hashSync(password, 10), s.id)
  db.prepare('DELETE FROM otps WHERE student_id = ?').run(s.id)
  const fresh = db.prepare('SELECT * FROM students WHERE id = ?').get(s.id)
  res.json({ token: signToken('student', s.id), user: studentOut(fresh) })
}))

app.get('/api/auth/me', auth(), wrap((req, res) => {
  res.json(req.student ? { role: 'student', user: studentOut(req.student) } : { role: 'admin', user: { id: req.admin.id, name: req.admin.name, email: req.admin.email } })
}))

/* ------------------------------------------------------------------- events */
app.get('/api/events', optionalAuth, wrap((req, res) => {
  const all = req.query.all === '1' && req.auth?.role === 'admin'
  const rows = db.prepare(`SELECT * FROM events ${all ? '' : "WHERE status != 'draft'"} ORDER BY start_date`).all()
  res.json(rows.map(eventOut))
}))

app.get('/api/events/:slug', optionalAuth, wrap((req, res) => {
  const r = db.prepare('SELECT * FROM events WHERE slug = ?').get(req.params.slug)
  if (!r || (r.status === 'draft' && req.auth?.role !== 'admin')) throw new HttpError(404, 'Event not found.')
  res.json(eventOut(r))
}))

function parseEventBody(b, existing) {
  const e = {}
  const need = (k, v) => { if (!v) throw new HttpError(400, `${k} is required.`); return v }
  e.title = need('Title', str(b.title, 150))
  e.description = need('Description', str(b.description, 4000))
  e.category = str(b.category, 40)
  if (!CATEGORIES.includes(e.category)) throw new HttpError(400, 'Choose a valid category.')
  e.status = str(b.status, 20) || existing?.status || 'published'
  if (!STATUSES.includes(e.status)) throw new HttpError(400, 'Invalid status.')
  e.venue = need('Venue', str(b.venue, 150))
  e.organiser = need('Organiser', str(b.organiser, 150))
  e.coordinator_name = str(b.coordinatorName, 100) || existing?.coordinator_name || ''
  e.coordinator_email = str(b.coordinatorEmail, 120) || existing?.coordinator_email || ''
  const date = str(b.date, 10), start = str(b.startTime, 5), end = str(b.endTime, 5), dl = str(b.deadline, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) throw new HttpError(400, 'Enter a valid event date, start time and end time.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dl)) throw new HttpError(400, 'Enter a valid registration deadline.')
  e.start_date = `${date}T${start}:00.000Z`
  e.end_date = `${date}T${end}:00.000Z`
  e.registration_deadline = `${dl}T23:59:00.000Z`
  if (e.end_date <= e.start_date) throw new HttpError(400, 'End time must be after the start time.')
  const max = Number(b.maxParticipants), fee = Number(b.fee || 0)
  if (!Number.isInteger(max) || max < 1) throw new HttpError(400, 'Maximum participants must be a whole number of at least 1.')
  if (!Number.isInteger(fee) || fee < 0) throw new HttpError(400, 'Fee must be 0 or more.')
  e.max_participants = max
  e.fee = fee
  e.eligibility = str(b.eligibility, 1000) || 'Open to all verified CampusConnect students'
  e.rules = str(b.rules, 3000)
  return e
}

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'event'

app.post('/api/events', auth('admin'), wrap((req, res) => {
  const e = parseEventBody(req.body)
  let slug = slugify(e.title), n = 1
  while (db.prepare('SELECT 1 FROM events WHERE slug = ?').get(slug)) slug = `${slugify(e.title)}-${++n}`
  const info = db.prepare(`INSERT INTO events
    (title,slug,description,category,status,start_date,end_date,registration_deadline,venue,organiser,coordinator_name,coordinator_email,max_participants,available_seats,fee,eligibility,rules,image,image_alt)
    VALUES (@title,@slug,@description,@category,@status,@start_date,@end_date,@registration_deadline,@venue,@organiser,@coordinator_name,@coordinator_email,@max_participants,@max_participants,@fee,@eligibility,@rules,'assets/media/aurora-tech-summit.svg',@title)`).run({ ...e, slug })
  res.status(201).json(eventOut(db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid)))
}))

app.put('/api/events/:id', auth('admin'), wrap((req, res) => {
  const cur = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!cur) throw new HttpError(404, 'Event not found.')
  const e = parseEventBody(req.body, cur)
  const taken = cur.max_participants - cur.available_seats
  if (e.max_participants < taken) throw new HttpError(400, `Capacity cannot be lower than the ${taken} seats already booked.`)
  db.prepare(`UPDATE events SET title=@title,description=@description,category=@category,status=@status,start_date=@start_date,end_date=@end_date,
    registration_deadline=@registration_deadline,venue=@venue,organiser=@organiser,coordinator_name=@coordinator_name,coordinator_email=@coordinator_email,
    max_participants=@max_participants,available_seats=@seats,fee=@fee,eligibility=@eligibility,rules=@rules,image_alt=@title WHERE id=@id`).run({
    ...e,
    seats: e.max_participants - taken,
    id: cur.id,
  })
  res.json(eventOut(db.prepare('SELECT * FROM events WHERE id = ?').get(cur.id)))
}))

app.delete('/api/events/:id', auth('admin'), wrap((req, res) => {
  const info = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id)
  if (!info.changes) throw new HttpError(404, 'Event not found.')
  res.json({ deleted: true })
}))

/* ------------------------------------------------------------- registrations */
const regOut = (r) => ({
  id: r.reg_pk,
  regId: r.reg_id,
  status: r.reg_status,
  createdAt: r.reg_created,
  event: eventOut(r), // r holds the event's own columns (e.*)
})
const REG_SELECT = `SELECT e.*, r.id AS reg_pk, r.reg_id, r.status AS reg_status, r.created_at AS reg_created
  FROM registrations r JOIN events e ON e.id = r.event_id`

app.post('/api/events/:slug/register', auth('student'), wrap((req, res) => {
  const ev = db.prepare('SELECT * FROM events WHERE slug = ?').get(req.params.slug)
  if (!ev || ev.status === 'draft') throw new HttpError(404, 'Event not found.')
  if (ev.status !== 'published') throw new HttpError(400, 'Registration for this event is closed.')
  if (ev.registration_deadline < new Date().toISOString()) throw new HttpError(400, 'The registration deadline has passed.')

  // optional profile details submitted with the form
  const b = req.body || {}
  db.prepare('UPDATE students SET phone = COALESCE(NULLIF(?, \'\'), phone), department = COALESCE(NULLIF(?, \'\'), department), year = COALESCE(NULLIF(?, \'\'), year) WHERE id = ?').run(
    str(b.phone, 30), str(b.department, 100), str(b.year, 30), req.student.id,
  )

  const result = db.transaction(() => {
    const fresh = db.prepare('SELECT available_seats FROM events WHERE id = ?').get(ev.id)
    const existing = db.prepare('SELECT * FROM registrations WHERE student_id = ? AND event_id = ?').get(req.student.id, ev.id)
    if (existing && existing.status !== 'cancelled') throw new HttpError(409, 'You are already registered for this event.')
    const status = fresh.available_seats > 0 ? 'confirmed' : 'waitlist'
    if (status === 'confirmed') db.prepare('UPDATE events SET available_seats = available_seats - 1 WHERE id = ?').run(ev.id)
    if (existing) {
      db.prepare("UPDATE registrations SET status = ?, created_at = datetime('now') WHERE id = ?").run(status, existing.id)
      return existing.id
    }
    const prefix = (ev.title.replace(/[^A-Za-z]/g, '').slice(0, 3) || 'EVT').toUpperCase()
    const info = db.prepare('INSERT INTO registrations (reg_id, student_id, event_id, status) VALUES (?,?,?,?)').run('tmp-' + crypto.randomUUID(), req.student.id, ev.id, status)
    const regId = `CC-${prefix}-26-${10000 + info.lastInsertRowid}`
    db.prepare('UPDATE registrations SET reg_id = ? WHERE id = ?').run(regId, info.lastInsertRowid)
    return info.lastInsertRowid
  })()
  res.status(201).json(regOut(db.prepare(`${REG_SELECT} WHERE r.id = ?`).get(result)))
}))

app.get('/api/registrations/mine', auth('student'), wrap((req, res) => {
  const rows = db.prepare(`${REG_SELECT} WHERE r.student_id = ? ORDER BY e.start_date`).all(req.student.id)
  res.json(rows.map(regOut))
}))

app.get('/api/registrations/:regId', auth('student'), wrap((req, res) => {
  const r = db.prepare(`${REG_SELECT} WHERE r.reg_id = ? AND r.student_id = ?`).get(req.params.regId, req.student.id)
  if (!r) throw new HttpError(404, 'Registration not found.')
  res.json(regOut(r))
}))

app.post('/api/registrations/:regId/cancel', auth('student'), wrap((req, res) => {
  db.transaction(() => {
    const r = db.prepare('SELECT * FROM registrations WHERE reg_id = ? AND student_id = ?').get(req.params.regId, req.student.id)
    if (!r) throw new HttpError(404, 'Registration not found.')
    if (r.status === 'cancelled') throw new HttpError(409, 'This registration is already cancelled.')
    db.prepare("UPDATE registrations SET status = 'cancelled' WHERE id = ?").run(r.id)
    if (r.status === 'confirmed') {
      // free the seat, then promote the oldest waitlisted student (if any)
      const next = db.prepare("SELECT id FROM registrations WHERE event_id = ? AND status = 'waitlist' ORDER BY created_at, id LIMIT 1").get(r.event_id)
      if (next) db.prepare("UPDATE registrations SET status = 'confirmed' WHERE id = ?").run(next.id)
      else db.prepare('UPDATE events SET available_seats = available_seats + 1 WHERE id = ?').run(r.event_id)
    }
  })()
  res.json({ cancelled: true })
}))

/* -------------------------------------------------------------- saved events */
app.get('/api/saved', auth('student'), wrap((req, res) => {
  res.json(db.prepare('SELECT event_id FROM saved_events WHERE student_id = ?').all(req.student.id).map((r) => String(r.event_id)))
}))
app.put('/api/saved/:eventId', auth('student'), wrap((req, res) => {
  if (!db.prepare('SELECT 1 FROM events WHERE id = ?').get(req.params.eventId)) throw new HttpError(404, 'Event not found.')
  db.prepare('INSERT OR IGNORE INTO saved_events (student_id, event_id) VALUES (?,?)').run(req.student.id, req.params.eventId)
  res.json({ saved: true })
}))
app.delete('/api/saved/:eventId', auth('student'), wrap((req, res) => {
  db.prepare('DELETE FROM saved_events WHERE student_id = ? AND event_id = ?').run(req.student.id, req.params.eventId)
  res.json({ saved: false })
}))

/* ------------------------------------------------------------------- profile */
app.put('/api/profile', auth('student'), wrap((req, res) => {
  const b = req.body || {}
  const interests = Array.isArray(b.interests) ? b.interests.filter((i) => CATEGORIES.includes(i)) : JSON.parse(req.student.interests)
  db.prepare('UPDATE students SET name = ?, phone = ?, department = ?, year = ?, interests = ? WHERE id = ?').run(
    str(b.name, 100) || req.student.name,
    str(b.phone, 30),
    str(b.department, 100) || req.student.department,
    str(b.year, 30) || req.student.year,
    JSON.stringify(interests),
    req.student.id,
  )
  res.json(studentOut(db.prepare('SELECT * FROM students WHERE id = ?').get(req.student.id)))
}))

/* --------------------------------------------------------------------- admin */
app.get('/api/admin/stats', auth('admin'), wrap((req, res) => {
  const c = (sql) => db.prepare(sql).get().c
  const nowIso = new Date().toISOString()
  res.json({
    totalStudents: c('SELECT COUNT(*) c FROM students WHERE verified = 1'),
    totalEvents: c("SELECT COUNT(*) c FROM events WHERE status != 'draft'"),
    upcomingEvents: db.prepare("SELECT COUNT(*) c FROM events WHERE status = 'published' AND start_date >= ?").get(nowIso).c,
    registrations: c("SELECT COUNT(*) c FROM registrations WHERE status = 'confirmed'"),
    waitlisted: c("SELECT COUNT(*) c FROM registrations WHERE status = 'waitlist'"),
    cancelled: c("SELECT COUNT(*) c FROM registrations WHERE status = 'cancelled'"),
    completedEvents: db.prepare("SELECT COUNT(*) c FROM events WHERE status = 'completed' OR end_date < ?").get(nowIso).c,
  })
}))

app.get('/api/admin/registrations', auth('admin'), wrap((req, res) => {
  const rows = db.prepare(`SELECT r.reg_id, r.status, r.created_at, s.name, s.enrollment, s.email, e.title AS event_title
    FROM registrations r JOIN students s ON s.id = r.student_id JOIN events e ON e.id = r.event_id ORDER BY r.created_at DESC, r.id DESC`).all()
  res.json(rows.map((r) => ({ regId: r.reg_id, status: r.status, createdAt: r.created_at, student: r.name, enrollment: r.enrollment, email: r.email, event: r.event_title })))
}))

app.get('/api/admin/students', auth('admin'), wrap((req, res) => {
  const nowIso = new Date().toISOString()
  const rows = db.prepare(`SELECT s.*,
      (SELECT COUNT(*) FROM registrations r WHERE r.student_id = s.id AND r.status != 'cancelled') AS events_count,
      (SELECT COUNT(*) FROM registrations r JOIN events e ON e.id = r.event_id WHERE r.student_id = s.id AND r.status = 'confirmed' AND e.end_date < ?) AS attended
    FROM students s WHERE s.verified = 1 ORDER BY s.name`).all(nowIso)
  res.json(rows.map((s) => ({ ...studentOut(s), events: s.events_count, attended: s.attended })))
}))

/* ------------------------------------------------------------ static + errors */
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html')))

app.use((err, req, res, next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on our side.' })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CampusConnect running at http://localhost:${PORT}`)
    console.log('Demo logins:  student  CC2024CS1042 / Student@123   |   admin  admin@campus.edu / Admin@123')
  })
}
module.exports = app
