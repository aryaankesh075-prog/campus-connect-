/* Admin screens (converted from CampusConnectApp.tsx) */

const buildStats = () => {
  const t = D.stats || {}
  const n = (v) => Number(v || 0).toLocaleString('en-IN')
  return [
    ['Total Students', n(t.totalStudents), 'Verified', 'UsersRound', '#4263eb'],
    ['Total Events', n(t.totalEvents), 'Published', 'CalendarDays', '#8b5cf6'],
    ['Upcoming Events', n(t.upcomingEvents), 'Open now', 'Sparkles', '#f59e0b'],
    ['Registrations', n(t.registrations), `${n(t.waitlisted)} waitlisted`, 'TicketCheck', '#16a34a'],
    ['Completed', n(t.completedEvents), 'Events held', 'CheckCircle2', '#0ea5e9'],
  ]
}

const STATUS_STYLE = {
  published: ['bg-green-50 text-green-700', 'Published'],
  draft: ['bg-amber-50 text-amber-700', 'Draft'],
  closed: ['bg-red-50 text-red-600', 'Closed'],
  completed: ['bg-[#edf0f5] text-[#667085]', 'Completed'],
}
const StatusBadge = (st) => `<span class="rounded-full ${STATUS_STYLE[st][0]} px-2.5 py-1 text-[9px] font-bold">${STATUS_STYLE[st][1]}</span>`
const initials = (n) => n.split(' ').map((x) => x[0]).join('')

function AdminDashboard() {
  return AdminShell('admin-dashboard', `
    ${PageTitle('Overview', `Good morning, ${esc(firstName())}`, 'Here’s what’s happening across CampusConnect today.',
      Link('/manage/events/create', 'flex h-11 items-center gap-2 rounded-xl bg-[#4263eb] px-4 text-xs font-bold text-white', `${Icon('Plus', { size: 16 })} Create event`))}
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      ${buildStats().map(([label, value, trend, icon, color]) => `<div class="rounded-[18px] border border-[#e2e6ed] bg-white p-5">
        <div class="flex items-center justify-between">
          <span class="grid size-9 place-items-center rounded-xl text-white" style="background:${color}">${Icon(icon, { size: 17 })}</span>
          <span class="text-[10px] font-bold text-green-600">${trend}</span>
        </div>
        <b class="mt-5 block text-2xl tracking-[-.04em] text-[#121b2b]">${value}</b>
        <span class="mt-1 block text-[11px] text-[#667085]">${label}</span>
      </div>`).join('')}
    </div>
    <div class="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.9fr]">
      <div class="rounded-[20px] border border-[#e2e6ed] bg-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-[#121b2b]">Registration activity</h3>
            <p class="mt-1 text-[11px] text-[#98a2b3]">Daily registrations over the last 7 days</p>
          </div>
          <span class="rounded-lg bg-[#f2f4f7] px-3 py-2 text-[10px] font-bold text-[#667085]">Last 7 days</span>
        </div>
        <div class="mt-8 flex h-52 items-end gap-3">
          ${[42, 58, 38, 72, 66, 94, 84, 112, 98, 128, 116, 146].map((h) => `<div class="group relative flex-1 rounded-t-lg bg-[#e6ebff] transition hover:bg-[#4263eb]" style="height:${h}px">
            <span class="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[9px] font-bold text-[#4263eb] group-hover:block">${h * 3}</span>
          </div>`).join('')}
        </div>
        <div class="mt-3 flex justify-between text-[9px] font-semibold text-[#98a2b3]">
          <span>10 Nov</span><span>12 Nov</span><span>14 Nov</span><span>16 Nov</span>
        </div>
      </div>
      <div class="rounded-[20px] border border-[#e2e6ed] bg-white p-6">
        <h3 class="font-bold text-[#121b2b]">Event performance</h3>
        <p class="mt-1 text-[11px] text-[#98a2b3]">Registration completion by category</p>
        <div class="mt-6 grid gap-5">
          ${[['Technical', 88, '#4263eb'], ['Cultural', 76, '#8b5cf6'], ['Workshops', 64, '#f59e0b'], ['Sports', 58, '#16a34a']].map(([n, v, c]) => `<div>
            <div class="mb-2 flex justify-between text-[11px] font-semibold"><span>${n}</span><b>${v}%</b></div>
            <div class="h-2 rounded-full bg-[#edf0f4]"><div class="h-full rounded-full" style="width:${v}%;background:${c}"></div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="mt-5 rounded-[20px] border border-[#e2e6ed] bg-white">
      <div class="flex items-center justify-between border-b border-[#edf0f4] p-5">
        <div>
          <h3 class="font-bold text-[#121b2b]">Upcoming events</h3>
          <p class="mt-1 text-[11px] text-[#98a2b3]">Capacity and registration health</p>
        </div>
        ${Link('/manage/events', 'text-xs font-bold text-[#4263eb]', 'View all')}
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-left">
          <thead class="bg-[#fafbfc] text-[9px] uppercase tracking-[.1em] text-[#98a2b3]">
            <tr><th class="px-5 py-3">Event</th><th>Date</th><th>Registrations</th><th>Available</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            ${events.filter((e) => e.status !== 'draft').slice(0, 4).map((e) => `<tr class="border-t border-[#edf0f4] text-xs">
              <td class="px-5 py-4 font-bold text-[#344054]">${esc(e.title)}</td>
              <td class="text-[#667085]">Dec ${new Date(e.startDate).getUTCDate()}</td>
              <td>${e.maxParticipants - e.availableSeats}</td>
              <td>${e.availableSeats}</td>
              <td>${StatusBadge(e.status)}</td>
              <td>${Icon('MoreHorizontal', { size: 16, cls: 'text-[#98a2b3]' })}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`)
}

function CreateEvent() {
  const ev = D.editEvent
  const label = (t) => `<span class="mb-2 block text-[13px] font-semibold text-[#344054]">${t}</span>`
  return AdminShell('create-event', `
    ${PageTitle('Events', ev ? 'Edit event' : 'Create a new event', ev ? 'Update event details, capacity and publishing status.' : 'Add event details, configure capacity and publish it to verified students.')}
    <div class="grid gap-5 xl:grid-cols-[1fr_310px]">
      <div class="space-y-5">
        ${AdminFormSection('Event basics', 'The essentials students will see first.', `
          ${Field('Event title', 'e.g. FutureTech Innovation Summit', '', 'text', 'title', ev?.title || '')}
          <label class="block">
            ${label('Event description')}
            <textarea name="description" rows="5" placeholder="Tell students what makes this event worth attending..." class="w-full rounded-xl border border-[#e1e5ed] p-4 text-sm outline-none focus:border-[#4263eb]">${esc(ev?.description || '')}</textarea>
          </label>
          <div class="grid gap-4 sm:grid-cols-2">
            ${Select('Category', 'category', categories.slice(1), ev?.category || '')}
            ${Field('Organising department / club', 'Computer Science Society', '', 'text', 'organiser', ev?.organiser || '')}
          </div>
          <label class="block">
            ${label('Event banner')}
            <span class="grid min-h-36 place-items-center rounded-2xl border-2 border-dashed border-[#d9dee8] bg-[#fafbfc] p-6 text-center">
              ${Icon('UploadCloud', { size: 27, cls: 'mx-auto text-[#4263eb]' })}
              <b class="mt-2 block text-xs text-[#344054]">Drop your banner here or browse</b>
              <small class="mt-1 block text-[10px] text-[#98a2b3]">Recommended 1600 × 900px • JPG or PNG</small>
            </span>
          </label>`)}
        ${AdminFormSection('Schedule &amp; venue', 'When and where students should show up.', `
          <div class="grid gap-4 sm:grid-cols-3">
            ${Field('Event date', '', '', 'date', 'date', ev ? ev.startDate.slice(0, 10) : '')}
            ${Field('Start time', '', '', 'time', 'startTime', ev ? ev.startDate.slice(11, 16) : '')}
            ${Field('End time', '', '', 'time', 'endTime', ev ? ev.endDate.slice(11, 16) : '')}
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${Field('Venue', 'Innovation Auditorium', '', 'text', 'venue', ev?.venue || '')}
            ${Field('Registration deadline', '', '', 'date', 'deadline', ev ? ev.registrationDeadline.slice(0, 10) : '')}
          </div>`)}
        ${AdminFormSection('Registration settings', 'Capacity, price and participation rules.', `
          <div class="grid gap-4 sm:grid-cols-2">
            ${Field('Maximum participants', '320', '', 'number', 'maxParticipants', ev ? ev.maxParticipants : '')}
            ${Field('Registration fee (₹)', '0', '', 'number', 'fee', ev ? ev.fee : '')}
          </div>
          ${Field('Eligibility criteria', 'Open to all verified CampusConnect students', '', 'text', 'eligibility', ev?.eligibility || '')}
          ${Field('Contact information', 'coordinator@campus.edu', '', 'text', 'coordinatorEmail', ev?.coordinatorEmail || '')}
          <label class="block">
            ${label('Event rules')}
            <textarea name="rules" rows="4" placeholder="Add one guideline per line..." class="w-full rounded-xl border border-[#e1e5ed] p-4 text-sm outline-none focus:border-[#4263eb]">${esc(ev?.rules || '')}</textarea>
          </label>`)}
      </div>
      <aside class="h-fit rounded-[20px] border border-[#e2e6ed] bg-white p-5 xl:sticky xl:top-24">
        <h3 class="text-sm font-bold text-[#121b2b]">${ev ? 'Save your changes' : 'Ready to publish?'}</h3>
        <p class="mt-2 text-[11px] leading-5 text-[#667085]">Complete all required fields. You can preview the student view before publishing.</p>
        ${FormMsg()}
        <div class="my-5 h-px bg-[#edf0f4]"></div>
        ${ev ? Link('/events/' + ev.slug, 'flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3eb] text-xs font-bold text-[#344054]', `${Icon('Eye', { size: 15 })} Preview event`) : `<button class="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3eb] text-xs font-bold text-[#344054]" disabled>${Icon('Eye', { size: 15 })} Preview event</button>`}
        <button data-action="save-event" data-status="${ev && ev.status !== 'draft' ? ev.status : 'published'}" class="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4263eb] text-xs font-bold text-white">${Icon('CheckCircle2', { size: 15 })} ${ev ? 'Save changes' : 'Publish event'}</button>
        <button data-action="save-event" data-status="draft" class="mt-3 w-full py-2 text-xs font-bold text-[#667085]">Save as draft</button>
        <div class="mt-5 rounded-xl bg-[#f7f8fc] p-4 text-[10px] leading-5 text-[#98a2b3]">Published events become visible to verified students immediately. Drafts stay hidden until you publish them.</div>
      </aside>
    </div>`)
}

function ManageEvents() {
  return AdminShell('manage-events', `
    ${PageTitle('Events', 'Manage events', 'Edit publishing details, monitor capacity and manage registration status.',
      Link('/manage/events/create', 'flex h-11 items-center gap-2 rounded-xl bg-[#4263eb] px-4 text-xs font-bold text-white', `${Icon('Plus', { size: 15 })} Create event`))}
    ${AdminToolbar('Search events...')}
    <div class="mt-5 overflow-hidden rounded-[20px] border border-[#e2e6ed] bg-white">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] text-left">
          <thead class="bg-[#fafbfc] text-[9px] uppercase tracking-[.1em] text-[#98a2b3]">
            <tr><th class="px-5 py-3">Event</th><th>Category</th><th>Date</th><th>Capacity</th><th>Status</th><th class="text-right pr-5">Actions</th></tr>
          </thead>
          <tbody>
            ${events.filter((e) => `${e.title} ${e.organiser} ${e.category}`.toLowerCase().includes(S.aq.toLowerCase())).map((e) => `<tr class="border-t border-[#edf0f4] text-xs">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <span class="relative h-11 w-16 overflow-hidden rounded-lg">${Img(e.image, '', 'object-cover')}</span>
                  <span>
                    <b class="block max-w-[240px] truncate text-[#344054]">${esc(e.title)}</b>
                    <small class="mt-1 block text-[10px] text-[#98a2b3]">${esc(e.organiser)}</small>
                  </span>
                </div>
              </td>
              <td><span class="rounded-full bg-[#edf1ff] px-2.5 py-1 text-[9px] font-bold text-[#4263eb]">${esc(e.category)}</span></td>
              <td class="text-[#667085]">Dec ${new Date(e.startDate).getUTCDate()}</td>
              <td><b>${e.maxParticipants - e.availableSeats}</b><span class="text-[#98a2b3]"> / ${e.maxParticipants}</span></td>
              <td>${StatusBadge(e.status)}</td>
              <td>
                <div class="flex justify-end gap-1.5 pr-5">
                  ${Link('/events/' + e.slug, 'grid size-8 place-items-center rounded-lg border border-[#e1e5ec] text-[#667085]', Icon('Eye', { size: 14 }))}
                  ${Link('/manage/events/create?edit=' + e.id, 'grid size-8 place-items-center rounded-lg border border-[#e1e5ec] text-[#667085]', Icon('FilePenLine', { size: 14 }))}
                  <button data-action="delete-event" data-id="${e.id}" data-title="${esc(e.title)}" class="grid size-8 place-items-center rounded-lg border border-[#e1e5ec] text-[#f04438]">${Icon('Trash2', { size: 14 })}</button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`)
}

function AdminRegistrations() {
  const t = D.stats || {}
  const q = S.aq.toLowerCase()
  const rows = D.adminRegs.filter((r) => `${r.student} ${r.enrollment} ${r.event} ${r.regId}`.toLowerCase().includes(q))
  const total = (t.registrations || 0) + (t.waitlisted || 0) + (t.cancelled || 0)
  const badge = { confirmed: 'bg-green-50 text-green-700', waitlist: 'bg-amber-50 text-amber-700', cancelled: 'bg-red-50 text-red-600' }
  const label = { confirmed: 'Confirmed', waitlist: 'Waitlisted', cancelled: 'Cancelled' }
  return AdminShell('admin-registrations', `
    ${PageTitle('Operations', 'Event registrations', 'Review, search and export student registrations across all events.')}
    <div class="mb-5 grid gap-4 sm:grid-cols-3">
      ${[['Total registrations', String(total)], ['Waitlisted', String(t.waitlisted || 0)], ['Confirmation rate', total ? ((t.registrations / total) * 100).toFixed(1) + '%' : '—']].map(([l, v]) => `<div class="rounded-[18px] border border-[#e2e6ed] bg-white p-5">
        <b class="text-2xl tracking-[-.04em] text-[#121b2b]">${v}</b>
        <p class="mt-1 text-[11px] text-[#667085]">${l}</p>
      </div>`).join('')}
    </div>
    ${AdminToolbar('Search student name or college ID...')}
    <div class="mt-5 overflow-hidden rounded-[20px] border border-[#e2e6ed] bg-white">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[850px] text-left">
          <thead class="bg-[#fafbfc] text-[9px] uppercase tracking-[.1em] text-[#98a2b3]">
            <tr><th class="px-5 py-3">Student</th><th>Event</th><th>College ID</th><th>Registered</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            ${rows.map((r) => {
              const d = new Date(r.createdAt.replace(' ', 'T') + 'Z')
              return `<tr class="border-t border-[#edf0f4] text-xs">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <span class="grid size-8 place-items-center rounded-lg bg-[#edf1ff] text-[10px] font-bold text-[#4263eb]">${esc(initials(r.student))}</span>
                  <b class="text-[#344054]">${esc(r.student)}</b>
                </div>
              </td>
              <td class="max-w-[230px] truncate text-[#667085]">${esc(r.event)}</td>
              <td class="font-mono text-[10px] text-[#667085]">${esc(r.enrollment)}</td>
              <td class="text-[#667085]">${d.getUTCDate()} ${d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })}, ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}</td>
              <td><span class="rounded-full ${badge[r.status]} px-2.5 py-1 text-[9px] font-bold">${label[r.status]}</span></td>
              <td class="font-mono text-[10px] text-[#98a2b3]">${esc(r.regId)}</td>
            </tr>` }).join('') || `<tr><td colspan="6" class="px-5 py-10 text-center text-xs text-[#98a2b3]">No registrations found.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`)
}

function Students() {
  const q = S.aq.toLowerCase()
  const list = D.students.filter((s) => `${s.name} ${s.enrollment} ${s.email} ${s.department}`.toLowerCase().includes(q))
  return AdminShell('students', `
    ${PageTitle('Directory', 'Student directory', 'Verified student profiles and campus participation at a glance.')}
    ${AdminToolbar('Search by name, ID, email or department...')}
    <div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      ${list.map((s) => `<div class="rounded-[18px] border border-[#e2e6ed] bg-white p-5">
        <div class="flex items-start justify-between">
          <span class="grid size-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#e2e8ff,#eee4ff)] text-xs font-extrabold text-[#4263eb]">${esc(initials(s.name))}</span>
          <span class="rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-bold text-green-700">Verified</span>
        </div>
        <h3 class="mt-4 text-sm font-bold text-[#121b2b]">${esc(s.name)}</h3>
        <p class="mt-1 text-[11px] text-[#667085]">${esc(s.enrollment)} • ${esc(deptShort(s.department))} ${esc(yearShort(s.year))}</p>
        <div class="mt-4 flex gap-4 border-t border-[#edf0f4] pt-4 text-[10px] text-[#98a2b3]">
          <span><b class="block text-sm text-[#344054]">${s.events}</b>Events</span>
          <span><b class="block text-sm text-[#344054]">${s.attended}</b>Attended</span>
          <span><b class="block text-sm text-[#344054]">${s.events ? Math.round((s.attended / s.events) * 100) + '%' : '—'}</b>Show rate</span>
        </div>
      </div>`).join('') || `<p class="text-xs text-[#98a2b3]">No students found.</p>`}
    </div>`)
}

function Analytics() {
  return AdminShell('analytics', `
    ${PageTitle('Insights', 'Analytics dashboard', 'Understand student interest, event performance and registration growth.',
      `<button class="flex h-11 items-center gap-2 rounded-xl border border-[#dfe3eb] bg-white px-4 text-xs font-bold text-[#344054]">${Icon('Download', { size: 15 })} Export report</button>`)}
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      ${[['Total reach', '42.8K', '+18.2%'], ['Conversion rate', '34.6%', '+4.1%'], ['Avg. fill time', '3.2 days', '-0.8d'], ['No-show rate', '12.6%', '-2.4%']].map(([l, v, t]) => `<div class="rounded-[18px] border border-[#e2e6ed] bg-white p-5">
        <div class="flex justify-between">
          ${Icon('Activity', { size: 17, cls: 'text-[#4263eb]' })}
          <span class="text-[10px] font-bold text-green-600">${t}</span>
        </div>
        <b class="mt-4 block text-2xl tracking-[-.04em] text-[#121b2b]">${v}</b>
        <p class="mt-1 text-[11px] text-[#667085]">${l}</p>
      </div>`).join('')}
    </div>
    <div class="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <div class="rounded-[20px] border border-[#e2e6ed] bg-white p-6">
        <h3 class="font-bold text-[#121b2b]">Registration growth</h3>
        <p class="mt-1 text-[11px] text-[#98a2b3]">Monthly performance across the academic year</p>
        <div class="relative mt-8 h-64">
          <div class="absolute inset-0 flex flex-col justify-between">
            ${[1, 2, 3, 4, 5].map(() => '<span class="border-t border-dashed border-[#e5e8ef]"></span>').join('')}
          </div>
          <svg viewBox="0 0 800 240" class="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4263eb" stop-opacity=".28" />
                <stop offset="100%" stop-color="#4263eb" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 210 C80 190,90 155,160 170 S280 120,340 135 S450 70,520 88 S640 30,800 42 L800 240 L0 240Z" fill="url(#area)" />
            <path d="M0 210 C80 190,90 155,160 170 S280 120,340 135 S450 70,520 88 S640 30,800 42" fill="none" stroke="#4263eb" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        <div class="mt-3 flex justify-between text-[9px] text-[#98a2b3]">
          <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span>
        </div>
      </div>
      <div class="rounded-[20px] border border-[#e2e6ed] bg-white p-6">
        <h3 class="font-bold text-[#121b2b]">Top categories</h3>
        <p class="mt-1 text-[11px] text-[#98a2b3]">Share of total registrations</p>
        <div class="mx-auto mt-8 grid size-44 place-items-center rounded-full bg-[conic-gradient(#4263eb_0_34%,#8b5cf6_34%_59%,#f59e0b_59%_77%,#16a34a_77%)]">
          <span class="grid size-28 place-items-center rounded-full bg-white text-center">
            <span><b class="block text-2xl text-[#121b2b]">8.6K</b><small class="text-[9px] text-[#98a2b3]">registrations</small></span>
          </span>
        </div>
        <div class="mt-7 grid grid-cols-2 gap-3 text-[10px]">
          ${[['Technical', '#4263eb'], ['Cultural', '#8b5cf6'], ['Workshops', '#f59e0b'], ['Sports', '#16a34a']].map(([n, c]) => `<span class="flex items-center gap-2"><i class="size-2 rounded-full" style="background:${c}"></i>${n}</span>`).join('')}
        </div>
      </div>
    </div>`)
}

function SettingsPage() {
  return AdminShell('settings', `
    ${PageTitle('Configuration', 'Admin settings', 'Manage portal preferences, event defaults and notification rules.')}
    <div class="grid gap-5 lg:grid-cols-[220px_1fr]">
      <nav class="h-fit rounded-[18px] border border-[#e2e6ed] bg-white p-2">
        ${['General', 'Event defaults', 'Notifications', 'Security', 'Integrations'].map((x, i) => `<button class="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs font-bold ${i === 0 ? 'bg-[#edf1ff] text-[#4263eb]' : 'text-[#667085]'}">${Icon('Settings', { size: 15 })}${x}</button>`).join('')}
      </nav>
      <div class="rounded-[20px] border border-[#e2e6ed] bg-white p-6">
        <h3 class="font-bold text-[#121b2b]">General settings</h3>
        <p class="mt-1 text-[11px] text-[#98a2b3]">Core campus and portal information.</p>
        <div class="mt-7 grid gap-5 sm:grid-cols-2">
          ${Field('Institution name', 'North Campus University')}
          ${Field('Campus code', 'NCU-01')}
          ${Field('Support email', 'support@campus.edu')}
          ${Field('Academic year', '2026–27')}
        </div>
        <div class="my-7 h-px bg-[#edf0f4]"></div>
        <h3 class="text-sm font-bold text-[#121b2b]">Registration preferences</h3>
        <div class="mt-4 grid gap-3">
          ${[['Require verified college ID', 'Only verified students can reserve event spots.'], ['Enable waitlists', 'Allow students to join when an event reaches capacity.'], ['Automatic confirmation', 'Confirm eligible registrations immediately.']].map(([t, c], i) => `<label class="flex items-center justify-between rounded-xl bg-[#f7f8fc] p-4">
            <span>
              <b class="block text-xs text-[#344054]">${t}</b>
              <small class="mt-1 block text-[10px] text-[#98a2b3]">${c}</small>
            </span>
            <input type="checkbox" ${i < 2 ? 'checked' : ''} class="size-4 accent-[#4263eb]">
          </label>`).join('')}
        </div>
        <div class="mt-7 flex justify-end">
          <button class="h-11 rounded-xl bg-[#4263eb] px-5 text-xs font-bold text-white">Save changes</button>
        </div>
      </div>
    </div>`)
}
