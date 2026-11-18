/* Shared helpers + components (converted from the React components in CampusConnectApp.tsx) */

/* ---------- UI state (replaces React useState) ---------- */
const S = {
  menuOpen: false, // StudentHeader mobile menu
  adminOpen: false, // AdminShell mobile sidebar
  saved: {}, // EventCard saved toggles
  sent: false, // Verify: OTP sent
  category: 'All Events', // Explore
  query: '', // Explore
  tab: 'Upcoming', // Registrations
  onlySaved: false, // Explore ?saved=true
  aq: '', // admin toolbar search
  error: '', // inline form error
  info: '', // inline form info
  devOtp: '', // dev-mode OTP hint
  busy: false,
  editProfile: false,
  toast: '',
}

// ---- date / name helpers (all UTC, matching the original formatting) ----
const pad2 = (n) => String(n).padStart(2, '0')
const timeStr = (d) => d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
const fmtLong = (iso) => { const d = new Date(iso); return `${d.toLocaleDateString('en', { weekday: 'long', timeZone: 'UTC' })}, ${pad2(d.getUTCDate())} ${d.toLocaleString('en', { month: 'long', timeZone: 'UTC' })} • ${timeStr(d)}` }
const fmtShort = (iso) => { const d = new Date(iso); return `${pad2(d.getUTCDate())} ${d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })} • ${timeStr(d)}` }
const fmtDeadline = (iso) => { const d = new Date(iso); return `${pad2(d.getUTCDate())} ${d.toLocaleString('en', { month: 'long', timeZone: 'UTC' })}, ${timeStr(d)}` }
const fmtMonDay = (iso) => { const d = new Date(iso); return `${d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })} ${pad2(d.getUTCDate())}` }
const todayLabel = () => { const d = new Date(); return `${d.toLocaleDateString('en', { weekday: 'long' })}, ${d.getDate()} ${d.toLocaleString('en', { month: 'long' })}`.toUpperCase() }
const firstName = () => (D.me?.name || '').split(' ')[0]
const initialsOf = (n) => (n || '').split(' ').filter(Boolean).map((x) => x[0]).join('').slice(0, 2).toUpperCase()
const deptShort = (d) => (d || '').split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !['and'].includes(w.toLowerCase())).map((w) => w[0].toUpperCase()).join('')
const yearShort = (y) => 'Year ' + ({ first: 1, second: 2, third: 3, fourth: 4, fifth: 5 }[(y || '').split(' ')[0].toLowerCase()] || '')
const currentEvent = () => {
  const slug = new URLSearchParams(location.search).get('slug')
  return slug ? events.find((e) => e.slug === slug) : events[0]
}
const myReg = (eventId) => D.regs.find((r) => r.event.id === eventId && r.status !== 'cancelled')
const FormMsg = () => (S.error ? `<p class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600" role="alert">${esc(S.error)}</p>` : '') + (S.info ? `<p class="mt-4 rounded-xl bg-[#f0fbf4] px-4 py-3 text-xs font-semibold text-[#147a3d]">${esc(S.info)}</p>` : '')

/* ---------- helpers ---------- */
const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Maps the original Next.js routes to the static .html files
function route(href) {
  const [path, query] = href.split('?')
  let file
  if (path === '/') file = 'index.html'
  else if (path.startsWith('/events/')) file = 'event.html'
  else if (path.startsWith('/register/')) file = 'register.html'
  else file = path.replace(/^\//, '').replace(/\//g, '-') + '.html'
  return file + (query ? '?' + query : '')
}

const Link = (href, cls, inner) => `<a href="${route(href)}" class="${cls}">${inner}</a>`

// next/image with `fill`
const Img = (src, alt, cls) =>
  `<img alt="${esc(alt)}" src="${esc(src)}" decoding="async" data-nimg="fill" class="${cls}" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" onerror="this.style.visibility='hidden'">`

const studentNav = [
  ['Home', '/dashboard'],
  ['Explore Events', '/explore'],
  ['My Registrations', '/registrations'],
  ['Saved Events', '/explore?saved=true'],
  ['Profile', '/profile'],
]

const adminNav = [
  ['Dashboard', '/manage/dashboard', 'LayoutDashboard'],
  ['Create Event', '/manage/events/create', 'Plus'],
  ['Manage Events', '/manage/events', 'CalendarDays'],
  ['Registrations', '/manage/registrations', 'TicketCheck'],
  ['Student Directory', '/manage/students', 'UsersRound'],
  ['Analytics', '/manage/analytics', 'BarChart3'],
  ['Settings', '/manage/settings', 'Settings'],
]

const categories = [
  'All Events',
  'Technical',
  'Cultural',
  'Sports',
  'Workshops',
  'Hackathons',
  'Seminars',
  'Competitions',
  'Festivals',
]

/* ---------- components ---------- */
function Logo(light = false) {
  return Link(
    '/',
    'flex items-center gap-2.5',
    `<span class="grid size-10 place-items-center rounded-xl ${light ? 'bg-white text-[#4263eb]' : 'bg-[#4263eb] text-white'} shadow-[0_8px_24px_rgba(66,99,235,.25)]">${Icon('GraduationCap', { size: 22, strokeWidth: 2.2 })}</span>
      <span class="text-[19px] font-extrabold tracking-[-.04em] ${light ? 'text-white' : 'text-[#121b2b]'}">Campus<span class="${light ? 'text-[#aebdff]' : 'text-[#4263eb]'}">Connect</span></span>`,
  )
}

function AuthShell(type, children) {
  const isAdmin = type === 'admin'
  return `<main class="min-h-screen ${isAdmin ? 'bg-[#0c1320]' : 'bg-[#f6f8fc]'} lg:grid lg:grid-cols-[1.02fr_.98fr]">
    <section class="relative hidden min-h-screen overflow-hidden lg:block">
      ${Img(isAdmin ? 'assets/media/university-campus.svg' : 'assets/media/campus-archway.svg', isAdmin ? 'University campus' : 'Students on campus', 'object-cover')}
      <div class="absolute inset-0 ${isAdmin ? 'bg-[linear-gradient(155deg,rgba(8,15,27,.74),rgba(66,99,235,.7))]' : 'bg-[linear-gradient(155deg,rgba(13,24,42,.18),rgba(15,32,66,.87))]'}"></div>
      <div class="absolute inset-x-0 top-0 flex items-center justify-between p-10">
        ${Logo(true)}
        <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">${isAdmin ? 'Administrator access' : 'Verified campus network'}</span>
      </div>
      <div class="absolute inset-x-0 bottom-0 max-w-2xl p-12 text-white">
        <span class="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] backdrop-blur-md">
          ${Icon('Sparkles', { size: 14 })} ${isAdmin ? 'Control center' : 'Your campus, connected'}
        </span>
        <h1 class="text-5xl font-bold leading-[1.08] tracking-[-.045em]">${isAdmin ? 'Create experiences students remember.' : 'Discover what’s happening beyond the classroom.'}</h1>
        <p class="mt-5 max-w-xl text-base leading-7 text-white/72">${isAdmin ? 'Publish events, manage capacity and understand engagement from one secure workspace.' : 'From hackathons to cultural nights, your next great campus moment starts here.'}</p>
      </div>
    </section>
    <section class="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
      <div class="w-full max-w-[470px]">
        <div class="mb-10 lg:hidden">${Logo(isAdmin)}</div>
        ${children}
      </div>
    </section>
  </main>`
}

function Field(label, placeholder, icon, type = 'text', name = '', value = '') {
  return `<label class="block">
    <span class="mb-2 block text-[13px] font-semibold text-[#344054]">${label}</span>
    <span class="relative block">
      ${icon ? Icon(icon, { size: 18, cls: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98a2b3]' }) : ''}
      <input type="${type}" ${name ? `name="${name}"` : ''} ${value !== '' ? `value="${esc(value)}"` : ''} placeholder="${placeholder}" class="h-12 w-full rounded-xl border border-[#e1e5ed] bg-white px-4 text-sm text-[#121b2b] outline-none transition focus:border-[#4263eb] focus:ring-4 focus:ring-[#4263eb]/10 ${icon ? 'pl-11' : ''}">
    </span>
  </label>`
}

function Select(label, name, options, value = '') {
  return `<label class="block">
    <span class="mb-2 block text-[13px] font-semibold text-[#344054]">${label}</span>
    <select name="${name}" class="h-12 w-full rounded-xl border border-[#e1e5ed] bg-white px-4 text-sm text-[#121b2b] outline-none transition focus:border-[#4263eb] focus:ring-4 focus:ring-[#4263eb]/10">
      <option value="">Select category</option>
      ${options.map((o) => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('')}
    </select>
  </label>`
}

function Toast() {
  return S.toast ? `<div class="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-[#121b2b] px-4 py-3 text-xs font-semibold text-white shadow-lg" role="status">${esc(S.toast)}</div>` : ''
}

function StudentHeader(active = 'Home') {
  const open = S.menuOpen
  return `<header class="sticky top-0 z-40 border-b border-[#e9ecf2] bg-white/92 backdrop-blur-xl">
    <div class="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
      ${Logo()}
      <nav class="hidden items-center gap-1 lg:flex">
        ${studentNav.map(([label, href]) => Link(href, `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === label ? 'bg-[#edf1ff] text-[#4263eb]' : 'text-[#667085] hover:bg-[#f7f8fc] hover:text-[#121b2b]'}`, label)).join('')}
      </nav>
      <div class="flex items-center gap-2.5">
        <button aria-label="Notifications" class="relative grid size-10 place-items-center rounded-xl border border-[#e6e9ef] text-[#344054] hover:bg-[#f7f8fc]">
          ${Icon('Bell', { size: 19 })}
          <span class="absolute right-2 top-2 size-1.5 rounded-full bg-[#f04438]"></span>
        </button>
        ${Link('/profile', 'flex items-center gap-2.5 rounded-xl p-1.5 pr-2 hover:bg-[#f7f8fc]',
          `<span class="grid size-9 place-items-center rounded-lg bg-[linear-gradient(135deg,#dce3ff,#e9dcff)] text-sm font-extrabold text-[#4263eb]">${esc(initialsOf(D.me?.name))}</span>
          <span class="hidden text-left sm:block">
            <b class="block text-xs text-[#121b2b]">${esc(D.me?.name || '')}</b>
            <span class="block text-[10px] text-[#98a2b3]">${esc(deptShort(D.me?.department))} • ${esc(yearShort(D.me?.year))}</span>
          </span>
          ${Icon('ChevronDown', { size: 14, cls: 'hidden text-[#98a2b3] sm:block' })}`)}
        <button data-action="toggle-menu" class="grid size-10 place-items-center rounded-xl lg:hidden">
          ${open ? Icon('X') : Icon('Menu')}
        </button>
      </div>
    </div>
    ${open ? `<nav class="grid gap-1 border-t border-[#e9ecf2] p-4 lg:hidden">
      ${studentNav.map(([label, href]) => Link(href, 'rounded-xl px-4 py-3 text-sm font-semibold text-[#344054] hover:bg-[#f2f4f7]', label)).join('')}
    </nav>` : ''}
  </header>`
}

function PageTitle(eyebrow, title, copy, action = '') {
  return `<div class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      ${eyebrow ? `<p class="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#4263eb]">${eyebrow}</p>` : ''}
      <h1 class="text-3xl font-bold tracking-[-.04em] text-[#121b2b] sm:text-[38px]">${title}</h1>
      ${copy ? `<p class="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">${copy}</p>` : ''}
    </div>
    ${action}
  </div>`
}

function EventCard(event, compact = false) {
  const key = event.id
  const saved = D.saved.includes(event.id)
  const date = new Date(event.startDate)
  const percent = Math.round((event.availableSeats / event.maxParticipants) * 100)
  return `<article class="group overflow-hidden rounded-[22px] border border-[#e7eaf0] bg-white shadow-[0_10px_35px_rgba(20,30,55,.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(30,45,80,.12)]">
    <div class="relative overflow-hidden ${compact ? 'h-40' : 'h-48'}">
      ${Img(event.image, event.imageAlt, 'object-cover transition duration-500 group-hover:scale-[1.04]')}
      <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
      <span class="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#4263eb] backdrop-blur">${esc(event.category)}</span>
      <button data-action="save" data-key="${key}" aria-label="Save event" class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/92 text-[#121b2b] shadow-sm backdrop-blur">
        ${saved ? Icon('BookmarkCheck', { size: 17, cls: 'text-[#4263eb]', fill: '#4263eb' }) : Icon('Bookmark', { size: 17 })}
      </button>
      <div class="absolute bottom-3 left-3 rounded-xl bg-white px-2.5 py-1.5 text-center shadow-md">
        <b class="block text-base leading-none text-[#121b2b]">${date.getUTCDate()}</b>
        <span class="text-[9px] font-extrabold uppercase text-[#f97316]">${date.toLocaleString('en', { month: 'short', timeZone: 'UTC' })}</span>
      </div>
    </div>
    <div class="p-5">
      <p class="mb-2 text-[11px] font-semibold text-[#8b5cf6]">${esc(event.organiser)}</p>
      ${Link('/events/' + event.slug, 'line-clamp-1 text-lg font-bold tracking-[-.025em] text-[#121b2b] hover:text-[#4263eb]', esc(event.title))}
      <div class="mt-3 grid gap-2 text-xs text-[#667085]">
        <span class="flex items-center gap-2">
          ${Icon('Clock3', { size: 14, cls: 'text-[#4263eb]' })}
          ${date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })} • ${date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })}
        </span>
        <span class="flex items-center gap-2">${Icon('MapPin', { size: 14, cls: 'text-[#4263eb]' })} ${esc(event.venue)}</span>
      </div>
      <div class="mt-4">
        <div class="mb-1.5 flex items-center justify-between text-[10px] font-semibold">
          <span class="${event.availableSeats ? 'text-[#667085]' : 'text-[#f04438]'}">${event.availableSeats ? `${event.availableSeats} seats left` : 'Sold out'}</span>
          <span class="text-[#344054]">${event.fee ? `₹${event.fee}` : 'Free'}</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-[#edf0f5]">
          <div class="h-full rounded-full ${percent < 10 ? 'bg-[#f04438]' : 'bg-[#4263eb]'}" style="width:${Math.max(4, percent)}%"></div>
        </div>
      </div>
      ${Link('/events/' + event.slug, 'mt-5 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#121b2b] text-xs font-bold text-white transition hover:bg-[#4263eb]',
        `${event.availableSeats ? 'View &amp; Register' : 'Join Waitlist'} ${Icon('ArrowRight', { size: 14 })}`)}
    </div>
  </article>`
}

function EmptyEvents() {
  return `<div class="rounded-[24px] border border-dashed border-[#ccd2df] bg-white p-14 text-center">
    ${Icon('CalendarDays', { size: 32, cls: 'mx-auto mb-4 text-[#98a2b3]' })}
    <h3 class="font-bold text-[#121b2b]">No events found</h3>
    <p class="mt-1 text-sm text-[#667085]">Try another category or check back soon.</p>
  </div>`
}

function Info(icon, label, value) {
  return `<div class="flex gap-3">
    <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf1ff] text-[#4263eb]">${Icon(icon, { size: 17 })}</span>
    <span>
      <small class="block text-[10px] font-bold uppercase tracking-[.08em] text-[#98a2b3]">${label}</small>
      <b class="mt-1 block text-xs leading-5 text-[#344054]">${value}</b>
    </span>
  </div>`
}

function TextPanel(title, text, icon) {
  return `<div class="rounded-[22px] border border-[#e5e8ef] bg-white p-6">
    <span class="grid size-9 place-items-center rounded-xl bg-[#f1edff] text-[#8b5cf6]">${Icon(icon, { size: 17 })}</span>
    <h3 class="mt-4 font-bold text-[#121b2b]">${title}</h3>
    <p class="mt-2 text-xs leading-6 text-[#667085]">${esc(text)}</p>
  </div>`
}

function ProfileItem(label, value) {
  return `<div>
    <small class="block text-[10px] font-bold uppercase tracking-[.08em] text-[#98a2b3]">${label}</small>
    <p class="mt-1.5 text-sm font-semibold text-[#344054]">${value}</p>
  </div>`
}

function QRPattern() {
  const on = [0, 1, 2, 7, 8, 9, 10, 19, 20, 29, 30, 39, 70, 71, 72, 77, 78, 79, 80, 89, 90, 99, 12, 14, 17, 22, 24, 27, 33, 35, 37, 42, 44, 46, 49, 53, 55, 58, 61, 64, 66, 73, 75, 82, 84, 86, 93, 95, 97]
  const cells = Array.from({ length: 100 }, (_, i) => on.includes(i))
  return `<div class="grid size-40 grid-cols-10 gap-[2px] rounded-xl border-8 border-white bg-white shadow-md">
    ${cells.map((c) => `<span class="${c ? 'bg-[#121b2b]' : 'bg-white'}"></span>`).join('')}
  </div>`
}

/* ---------- admin ---------- */
const adminActiveMap = {
  'admin-dashboard': 'Dashboard',
  'create-event': 'Create Event',
  'manage-events': 'Manage Events',
  'admin-registrations': 'Registrations',
  students: 'Student Directory',
  analytics: 'Analytics',
  settings: 'Settings',
}

function AdminShell(screen, children) {
  const open = S.adminOpen
  return `<main class="min-h-screen bg-[#f2f4f8] lg:grid lg:grid-cols-[255px_1fr]">
    <aside id="admin-aside" class="fixed inset-y-0 left-0 z-50 w-[255px] bg-[#101a2b] p-5 text-white transition lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}">
      <div class="flex items-center justify-between">
        ${Logo(true)}
        <button data-action="admin-close" class="lg:hidden">${Icon('X')}</button>
      </div>
      <p class="mt-8 px-3 text-[9px] font-bold uppercase tracking-[.18em] text-white/35">Workspace</p>
      <nav class="mt-3 grid gap-1">
        ${adminNav.map(([label, href, icon]) => Link(href, `flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold transition ${adminActiveMap[screen] === label ? 'bg-[#4263eb] text-white shadow-[0_8px_20px_rgba(66,99,235,.26)]' : 'text-white/55 hover:bg-white/6 hover:text-white'}`, `${Icon(icon, { size: 17 })}${label}`)).join('')}
      </nav>
      <div class="absolute inset-x-5 bottom-5">
        <div class="mb-3 rounded-xl border border-white/8 bg-white/[.04] p-3">
          <p class="text-xs font-bold">Admin Workspace</p>
          <p class="mt-1 text-[10px] text-white/40">North Campus</p>
        </div>
        <button data-action="logout" class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold text-white/45 hover:bg-white/5 hover:text-white">${Icon('LogOut', { size: 17 })} Logout</button>
      </div>
    </aside>
    <section class="min-w-0">
      <header class="flex h-[72px] items-center justify-between border-b border-[#e2e6ed] bg-white px-5 lg:px-7">
        <div class="flex items-center gap-3">
          <button data-action="admin-open" class="grid size-10 place-items-center rounded-xl bg-[#f2f4f7] lg:hidden">${Icon('Menu', { size: 19 })}</button>
          <div>
            <h2 class="text-sm font-bold text-[#121b2b]">${adminActiveMap[screen]}</h2>
            <p class="text-[10px] text-[#98a2b3]">CampusConnect Administration</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="grid size-9 place-items-center rounded-xl border border-[#e3e7ee] text-[#667085]">${Icon('Bell', { size: 17 })}</button>
          <span class="grid size-9 place-items-center rounded-xl bg-[#121b2b] text-xs font-bold text-white">${esc(initialsOf(D.me?.name))}</span>
          <span class="hidden text-xs font-bold text-[#344054] sm:block">${esc(D.me?.name || '')}</span>
        </div>
      </header>
      <div class="p-5 lg:p-7">${children}</div>
    </section>
  </main>`
}

function AdminFormSection(title, copy, children) {
  return `<section class="rounded-[20px] border border-[#e2e6ed] bg-white p-6">
    <div class="mb-6">
      <h3 class="font-bold text-[#121b2b]">${title}</h3>
      <p class="mt-1 text-[11px] text-[#98a2b3]">${copy}</p>
    </div>
    <div class="grid gap-5">${children}</div>
  </section>`
}

function AdminToolbar(placeholder) {
  return `<div class="flex flex-col gap-3 rounded-[18px] border border-[#e2e6ed] bg-white p-3 sm:flex-row">
    <div class="relative flex-1">
      ${Icon('Search', { size: 16, cls: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98a2b3]' })}
      <input data-bind="aq" value="${esc(S.aq)}" placeholder="${placeholder}" class="h-10 w-full rounded-xl bg-[#f7f8fc] pl-10 pr-3 text-xs outline-none">
    </div>
    <button class="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e1e5ec] px-4 text-xs font-bold text-[#667085]">${Icon('Filter', { size: 14 })} Filter</button>
    <button class="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e1e5ec] px-4 text-xs font-bold text-[#667085]">${Icon('Download', { size: 14 })} Export</button>
  </div>`
}
