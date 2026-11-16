/* Entry point: picks the screen from <body data-screen>, loads data from the API, renders it and
   wires up interactions. Replaces the React `CampusConnectApp` switch + hooks. */

function CampusConnectApp(name) {
  if (name === 'landing') return Landing()
  if (name === 'student-login') return StudentLogin()
  if (name === 'verify') return Verify()
  if (name === 'admin-login') return AdminLogin()
  if (name === 'dashboard') return Dashboard()
  if (name === 'explore') return Explore()
  if (name === 'event') return EventDetail()
  if (name === 'register') return Register()
  if (name === 'success') return Success()
  if (name === 'registrations') return Registrations()
  if (name === 'profile') return Profile()
  if (name === 'admin-dashboard') return AdminDashboard()
  if (name === 'create-event') return CreateEvent()
  if (name === 'manage-events') return ManageEvents()
  if (name === 'admin-registrations') return AdminRegistrations()
  if (name === 'students') return Students()
  if (name === 'analytics') return Analytics()
  return SettingsPage()
}

const root = document.getElementById('root')
const SCREEN = document.body.dataset.screen
const params = new URLSearchParams(location.search)
const PUBLIC_SCREENS = ['landing', 'student-login', 'verify', 'admin-login']
const ADMIN_SCREENS = ['admin-dashboard', 'create-event', 'manage-events', 'admin-registrations', 'students', 'analytics', 'settings']

/* ---------- rendering (keeps typed values / focus / scroll, like React) ---------- */
function render() {
  const fields = [...root.querySelectorAll('input, textarea, select')]
  const saved = fields.map((el) => ({ value: el.value, checked: el.checked }))
  const focusIndex = fields.indexOf(document.activeElement)
  const sel = focusIndex > -1 ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null
  const scrollY = window.scrollY

  root.innerHTML = CampusConnectApp(SCREEN) + Toast()

  const next = [...root.querySelectorAll('input, textarea, select')]
  next.forEach((el, i) => {
    if (!saved[i]) return
    if (el.type === 'checkbox') el.checked = saved[i].checked
    else if (!(saved[i].value === '' && el.value !== '' && el.dataset.otp === undefined && el.type === 'hidden')) el.value = saved[i].value
  })
  if (focusIndex > -1 && next[focusIndex]) {
    next[focusIndex].focus()
    try { next[focusIndex].setSelectionRange(sel[0], sel[1]) } catch (_) {}
  }
  window.scrollTo(0, scrollY)
}

let toastTimer
function toast(msg) {
  S.toast = msg
  render()
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { S.toast = ''; render() }, 3000)
}

/* ---------- loading data + route guards ---------- */
async function loadStudent() {
  const [ev, savedIds, regs] = await Promise.all([API.get('/api/events'), API.get('/api/saved'), API.get('/api/registrations/mine')])
  events = ev
  D.saved = savedIds
  D.regs = regs
  if (SCREEN === 'success') {
    if (!params.get('reg')) return location.replace('registrations.html')
    D.reg = await API.get('/api/registrations/' + encodeURIComponent(params.get('reg')))
  }
}

async function loadAdmin() {
  const jobs = [API.get('/api/events?all=1'), API.get('/api/admin/stats')]
  if (SCREEN === 'admin-registrations') jobs.push(API.get('/api/admin/registrations'))
  if (SCREEN === 'students') jobs.push(API.get('/api/admin/students'))
  const [ev, stats, extra] = await Promise.all(jobs)
  events = ev
  D.stats = stats
  if (SCREEN === 'admin-registrations') D.adminRegs = extra
  if (SCREEN === 'students') D.students = extra
  if (SCREEN === 'create-event' && params.get('edit')) D.editEvent = events.find((e) => e.id === params.get('edit')) || null
}

async function boot() {
  if (!PUBLIC_SCREENS.includes(SCREEN)) {
    const admin = ADMIN_SCREENS.includes(SCREEN)
    const loginPage = admin ? 'admin-login.html' : 'student-login.html'
    if (!API.token || API.role !== (admin ? 'admin' : 'student')) return location.replace(loginPage)
    try {
      D.me = (await API.get('/api/auth/me')).user
      if (admin) await loadAdmin()
      else await loadStudent()
    } catch (e) {
      if (e.status === 401 || e.status === 403) { API.clear(); return location.replace(loginPage) }
      S.toast = e.message
    }
  }
  if (SCREEN === 'explore') {
    const c = params.get('category')
    if (c && categories.includes(c)) S.category = c
    S.onlySaved = params.get('saved') === 'true'
  }
  render()
}

/* ---------- actions ---------- */
const val = (name) => root.querySelector(`[name="${name}"]`)?.value ?? ''

// run an async action; show the error inline (S.error) and re-render
async function run(fn) {
  S.error = ''
  S.info = ''
  try { await fn() } catch (e) { S.error = e.message }
  render()
}

const actions = {
  'toggle-menu': () => { S.menuOpen = !S.menuOpen; render() },
  'set-category': (el) => { S.category = el.dataset.value; render() },
  'set-tab': (el) => { S.tab = el.dataset.value; render() },
  'admin-open': () => toggleAdmin(true),
  'admin-close': () => toggleAdmin(false),

  'student-login': () => run(async () => {
    const r = await API.post('/api/auth/student/login', { enrollment: val('enrollment'), email: val('email'), password: val('password') })
    API.login(r.token, 'student')
    location.href = 'dashboard.html'
  }),
  'admin-login': () => run(async () => {
    const r = await API.post('/api/auth/admin/login', { email: val('email'), password: val('password') })
    API.login(r.token, 'admin')
    location.href = 'manage-dashboard.html'
  }),
  'send-otp': () => run(async () => {
    const r = await API.post('/api/auth/otp/send', { enrollment: val('enrollment'), email: val('email') })
    S.sent = true
    S.maskedEmail = r.maskedEmail
    S.devOtp = r.devOtp || ''
  }),
  'verify-otp': () => run(async () => {
    const otp = [...root.querySelectorAll('[data-otp]')].map((i) => i.value).join('')
    const r = await API.post('/api/auth/otp/verify', { enrollment: val('enrollment'), email: val('email'), otp, password: val('newPassword') })
    API.login(r.token, 'student')
    location.href = 'dashboard.html'
  }),
  logout: () => {
    const admin = API.role === 'admin'
    API.clear()
    location.href = admin ? 'admin-login.html' : 'index.html'
  },

  save: async (el) => {
    const id = el.dataset.key
    const was = D.saved.includes(id)
    try {
      if (was) await API.del('/api/saved/' + id)
      else await API.put('/api/saved/' + id)
      D.saved = was ? D.saved.filter((x) => x !== id) : [...D.saved, id]
      render()
    } catch (e) { toast(e.message) }
  },

  register: (el) => run(async () => {
    if (!root.querySelector('[name="terms"]').checked) throw new Error('Please confirm the terms to continue.')
    const r = await API.post(`/api/events/${el.dataset.slug}/register`, { phone: val('phone'), department: val('department'), year: val('year') })
    location.href = 'registration-success.html?reg=' + encodeURIComponent(r.regId)
  }),
  'cancel-reg': async (el) => {
    if (!confirm('Cancel this registration? Your seat will be released.')) return
    try {
      await API.post(`/api/registrations/${encodeURIComponent(el.dataset.reg)}/cancel`)
      D.regs = await API.get('/api/registrations/mine')
      events = await API.get('/api/events')
      toast('Registration cancelled')
    } catch (e) { toast(e.message) }
  },

  'profile-edit': () => { S.editProfile = true; S.error = ''; render() },
  'profile-cancel': () => { S.editProfile = false; S.error = ''; render() },
  'profile-save': () => run(async () => {
    D.me = await API.put('/api/profile', { name: val('name'), phone: val('phone'), department: val('department'), year: val('year'), interests: D.me.interests })
    S.editProfile = false
  }),

  'save-event': (el) => run(async () => {
    const f = ['title', 'description', 'category', 'organiser', 'date', 'startTime', 'endTime', 'venue', 'deadline', 'maxParticipants', 'fee', 'eligibility', 'coordinatorEmail', 'rules']
    const body = Object.fromEntries(f.map((n) => [n, val(n)]))
    body.status = el.dataset.status
    if (D.editEvent) await API.put('/api/events/' + D.editEvent.id, body)
    else await API.post('/api/events', body)
    location.href = 'manage-events.html'
  }),
  'delete-event': async (el) => {
    if (!confirm(`Delete “${el.dataset.title}”? This also removes its registrations.`)) return
    try {
      await API.del('/api/events/' + el.dataset.id)
      events = events.filter((e) => e.id !== el.dataset.id)
      D.stats = await API.get('/api/admin/stats')
      toast('Event deleted')
    } catch (e) { toast(e.message) }
  },
}

function toggleAdmin(open) {
  S.adminOpen = open
  const aside = document.getElementById('admin-aside')
  aside.classList.toggle('translate-x-0', open)
  aside.classList.toggle('-translate-x-full', !open)
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]')
  if (el && actions[el.dataset.action]) actions[el.dataset.action](el)
})

document.addEventListener('input', (e) => {
  const t = e.target
  if (t.dataset.bind === 'query') { S.query = t.value; render() }
  else if (t.dataset.bind === 'aq') { S.aq = t.value; render() }
  else if (t.dataset.otp !== undefined && t.value) {
    const boxes = [...root.querySelectorAll('[data-otp]')]
    boxes[boxes.indexOf(t) + 1]?.focus()
  }
})

boot()
