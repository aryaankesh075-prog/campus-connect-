/* Seeds demo data. Runs automatically on first start (empty DB). `npm run seed` resets everything. */
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

if (process.argv.includes('--reset')) {
  const file = process.env.DB_PATH || path.join(__dirname, 'campus.db')
  for (const f of [file, file + '-wal', file + '-shm']) if (fs.existsSync(f)) fs.unlinkSync(f)
}
const db = require('./db')

const events = [
  ['Aurora Tech Summit 2026', 'aurora-tech-summit-2026', 'A full-day summit on AI, cloud and the future of software, featuring keynotes, live demos and startup showcases from industry leaders and student innovators.', 'Technical', '2026-12-05T09:30', '2026-12-05T17:30', '2026-12-03T18:00', 'Innovation Auditorium', 'Computer Science Society', 'Prof. Meera Iyer', 'meera.iyer@campus.edu', 320, 42, 0, 'Open to all verified CampusConnect students from every department and year.', 'Carry your college ID and QR pass. Registration is non-transferable. Recording is allowed only in designated areas.', 1, 'assets/media/aurora-tech-summit.svg'],
  ['CodeStorm 24-Hour Hackathon', 'codestorm-hackathon-2026', 'Build, break and ship in 24 hours. Teams of up to four tackle real campus problems with mentors on call and prizes for the best prototypes.', 'Hackathons', '2026-12-12T09:30', '2026-12-13T09:30', '2026-12-10T18:00', 'Engineering Block, Lab 4', 'Developers Club', 'Rahul Khanna', 'rahul.khanna@campus.edu', 200, 18, 150, 'Undergraduate and postgraduate students. Teams of 2–4 members.', 'Original work only. Bring your own laptop. Plagiarised projects are disqualified.', 0, 'assets/media/codestorm-hackathon.svg'],
  ['Rangmanch Cultural Night', 'rangmanch-cultural-night-2026', 'An evening of music, dance and theatre performed by student groups from across the campus clubs.', 'Cultural', '2026-12-14T09:30', '2026-12-14T15:30', '2026-12-12T18:00', 'Open Air Theatre', 'Cultural Committee', 'Ananya Rao', 'ananya.rao@campus.edu', 600, 260, 100, 'Open to all verified students.', 'Gates open 30 minutes before the show. Outside food is not permitted.', 0, 'assets/media/rangmanch-cultural-night.svg'],
  ['Inter-College Football Cup', 'inter-college-football-cup-2026', 'Knockout football tournament with teams from eight colleges battling for the championship trophy.', 'Sports', '2026-12-18T09:30', '2026-12-18T15:30', '2026-12-15T18:00', 'Main Sports Ground', 'Sports Council', 'Coach Vikram Singh', 'sports@campus.edu', 120, 0, 0, 'Registered members of college football teams.', 'Valid medical fitness certificate required. Studs must follow the official kit list.', 0, 'assets/media/football-cup.svg'],
  ['Design Thinking Workshop', 'design-thinking-workshop-2026', 'A hands-on workshop on solving problems the human-centred way, from empathy maps to rapid prototypes.', 'Workshops', '2026-12-20T09:30', '2026-12-20T13:30', '2026-12-18T18:00', 'Seminar Hall B', 'Design Club', 'Isha Kapoor', 'isha.kapoor@campus.edu', 80, 35, 50, 'Open to all verified students. No prior experience needed.', 'Limited seats. Please bring a notebook and a pen.', 0, 'assets/media/design-workshop.svg'],
  ['Winter Fest 2026', 'winter-fest-2026', 'The campus-wide winter festival with food stalls, live bands, games and a closing night concert.', 'Festivals', '2026-12-22T09:30', '2026-12-22T21:30', '2026-12-20T18:00', 'Central Quadrangle', 'Student Council', 'Nisha Menon', 'nisha.menon@campus.edu', 1500, 900, 200, 'Open to all verified students. One guest pass per student.', 'Valid college ID required at entry. No glass bottles or sharp objects.', 0, 'assets/media/winter-fest.svg'],
]

function seed() {
  if (db.prepare('SELECT COUNT(*) c FROM admins').get().c) return false
  const hash = (p) => bcrypt.hashSync(p, 10)

  db.prepare('INSERT INTO admins (name, email, password_hash) VALUES (?,?,?)').run('Nisha Menon', 'admin@campus.edu', hash('Admin@123'))

  const insStudent = db.prepare(
    'INSERT INTO students (enrollment,name,email,phone,department,year,interests,password_hash,verified) VALUES (?,?,?,?,?,?,?,?,?)',
  )
  const students = [
    ['CC2024CS1042', 'Aarav Sharma', 'aarav.sharma@campus.edu', '+91 98765 43210', 'Computer Science & Engineering', 'Third year'],
    ['CC2024CS1043', 'Diya Patel', 'diya.patel@campus.edu', '+91 98765 11111', 'Computer Science & Engineering', 'Second year'],
    ['CC2024CS1044', 'Kabir Mehta', 'kabir.mehta@campus.edu', '+91 98765 22222', 'Computer Science & Engineering', 'Third year'],
    ['CC2024CS1045', 'Ananya Rao', 'ananya.rao@campus.edu', '+91 98765 33333', 'Computer Science & Engineering', 'Fourth year'],
    ['CC2024CS1046', 'Rohan Das', 'rohan.das@campus.edu', '+91 98765 44444', 'Computer Science & Engineering', 'Second year'],
    ['CC2024CS1047', 'Meera Nair', 'meera.nair@campus.edu', '+91 98765 55555', 'Computer Science & Engineering', 'Third year'],
    ['CC2024CS1048', 'Ishaan Verma', 'ishaan.verma@campus.edu', '+91 98765 66666', 'Computer Science & Engineering', 'Fourth year'],
  ]
  students.forEach((s, i) =>
    insStudent.run(...s, JSON.stringify(i === 0 ? ['Hackathons', 'Technical', 'Workshops', 'Cultural'] : ['Technical']), hash('Student@123'), 1),
  )
  // Eligible but not yet verified: use the "Verify College ID" page to create the account
  insStudent.run('CC2024CS2001', 'Priya Singh', 'priya.singh@campus.edu', '', 'Computer Science & Engineering', 'First year', '[]', null, 0)

  const insEvent = db.prepare(`INSERT INTO events
    (title,slug,description,category,status,start_date,end_date,registration_deadline,venue,organiser,coordinator_name,coordinator_email,max_participants,available_seats,fee,eligibility,rules,featured,image,image_alt)
    VALUES (?,?,?,?, 'published', ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
  for (const e of events) {
    const [title, slug, desc, cat, s, en, dl, venue, org, cn, ce, max, avail, fee, elig, rules, feat, img] = e
    insEvent.run(title, slug, desc, cat, s + ':00.000Z', en + ':00.000Z', dl + ':00.000Z', venue, org, cn, ce, max, avail, fee, elig, rules, feat, img, title)
  }

  // a few demo registrations (Aarav is registered for the first two events)
  const insReg = db.prepare('INSERT INTO registrations (reg_id,student_id,event_id,status) VALUES (?,?,?,?)')
  insReg.run('CC-AUR-26-10428', 1, 1, 'confirmed')
  insReg.run('CC-COD-26-10429', 1, 2, 'confirmed')
  ;[[2, 1], [3, 1], [4, 2], [5, 3], [6, 3], [7, 5]].forEach(([s, e], i) =>
    insReg.run(`CC-DEM-26-${10500 + i}`, s, e, 'confirmed'),
  )
  return true
}

if (seed()) console.log('✔ Seeded demo data')
else if (require.main === module) console.log('Database already has data (use `npm run seed` to reset).')
module.exports = seed
