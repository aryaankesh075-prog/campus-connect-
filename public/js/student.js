/* Student-facing screens (converted from CampusConnectApp.tsx) */

function Landing() {
  const features = [
    ['01', 'Discover what fits you', 'Curated events across technology, culture, sports and more.'],
    ['02', 'Reserve in seconds', 'Live availability, transparent fees and instant confirmation.'],
    ['03', 'One pass, zero friction', 'Your event tickets and QR passes stay together, always ready.'],
  ]
  return `<main class="min-h-screen bg-[#f8f9fc]">
    <header class="absolute inset-x-0 top-0 z-20">
      <div class="mx-auto flex h-24 max-w-[1380px] items-center justify-between px-6">
        ${Logo(true)}
        <div class="flex items-center gap-3">
          ${Link('/student-login', 'hidden rounded-xl px-4 py-2.5 text-sm font-bold text-white/80 sm:block', 'Student Login')}
          ${Link('/admin-login', 'rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur', 'Admin Portal')}
        </div>
      </div>
    </header>
    <section class="relative flex min-h-[760px] items-center overflow-hidden bg-[#10192a]">
      ${Img('assets/media/music-festival.svg', 'Students at a campus festival', 'object-cover opacity-60')}
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,31,.97)_0%,rgba(10,18,31,.84)_48%,rgba(10,18,31,.22)_100%)]"></div>
      <div class="absolute -left-32 top-40 size-96 rounded-full bg-[#4263eb]/25 blur-[100px]"></div>
      <div class="relative mx-auto w-full max-w-[1380px] px-6 pt-24">
        <div class="max-w-[720px]">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#d9e0ff] backdrop-blur">
            <span class="size-2 rounded-full bg-[#62d291]"></span> 42 campus events happening this month
          </span>
          <h1 class="mt-7 text-5xl font-bold leading-[1.02] tracking-[-.055em] text-white sm:text-7xl">
            Campus life,
            <br>
            <span class="text-[#8ea4ff]">all in one place.</span>
          </h1>
          <p class="mt-6 max-w-xl text-base leading-7 text-white/66 sm:text-lg">Discover unforgettable events, reserve your spot and show up with one seamless campus pass.</p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            ${Link('/student-login', 'flex h-13 items-center justify-center gap-2 rounded-xl bg-[#4263eb] px-6 text-sm font-bold text-white shadow-[0_12px_35px_rgba(66,99,235,.38)] hover:bg-[#3451cf]', `Continue as Student ${Icon('ArrowRight', { size: 17 })}`)}
            ${Link('/admin-login', 'flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur hover:bg-white/15', `${Icon('ShieldCheck', { size: 17 })} Admin Login`)}
          </div>
          <div class="mt-12 flex items-center gap-7 text-white/55">
            <span><b class="block text-xl text-white">12.4K</b><small>Verified students</small></span>
            <span class="h-9 w-px bg-white/15"></span>
            <span><b class="block text-xl text-white">180+</b><small>Events hosted</small></span>
            <span class="h-9 w-px bg-white/15"></span>
            <span><b class="block text-xl text-white">34</b><small>Campus clubs</small></span>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto grid max-w-[1160px] gap-5 px-6 py-20 md:grid-cols-3">
      ${features.map(([n, t, c]) => `<div class="rounded-[24px] border border-[#e6e9f0] bg-white p-7 shadow-[0_14px_45px_rgba(20,30,60,.05)]">
        <span class="text-xs font-extrabold text-[#4263eb]">${n}</span>
        <h3 class="mt-7 text-lg font-bold text-[#121b2b]">${t}</h3>
        <p class="mt-2 text-sm leading-6 text-[#667085]">${c}</p>
      </div>`).join('')}
    </section>
  </main>`
}

function StudentLogin() {
  return AuthShell('student', `<div class="rounded-[28px] bg-white p-7 shadow-[0_24px_70px_rgba(24,36,64,.09)] sm:p-9">
    <span class="inline-flex items-center gap-2 text-xs font-bold text-[#4263eb]">${Icon('ShieldCheck', { size: 15 })} STUDENT ACCESS</span>
    <h2 class="mt-4 text-3xl font-bold tracking-[-.04em] text-[#121b2b]">Welcome back</h2>
    <p class="mt-2 text-sm text-[#667085]">Use your verified college credentials to continue.</p>
    <div class="mt-7 grid gap-4">
      ${Field('College ID / Enrollment Number', 'e.g. CC2024CS1042', 'GraduationCap', 'text', 'enrollment')}
      ${Field('College Email ID', 'you@campus.edu', 'Mail', 'email', 'email')}
      ${Field('Password', 'Enter your password', 'LockKeyhole', 'password', 'password')}
    </div>
    <div class="mt-4 flex items-center justify-between text-xs">
      <label class="flex items-center gap-2 text-[#667085]"><input type="checkbox" class="accent-[#4263eb]"> Remember me</label>
      <button class="font-bold text-[#4263eb]">Forgot password?</button>
    </div>
    ${FormMsg()}
    <button data-action="student-login" class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4263eb] text-sm font-bold text-white shadow-[0_10px_25px_rgba(66,99,235,.25)]">Continue securely ${Icon('ArrowRight', { size: 16 })}</button>
    ${Link('/verify', 'mt-3 flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dfe3eb] text-sm font-bold text-[#344054]', `${Icon('ShieldCheck', { size: 16 })} Verify College ID`)}
    <p class="mt-6 text-center text-xs text-[#667085]">
      New to CampusConnect? ${Link('/verify', 'font-bold text-[#4263eb]', 'Create an eligible account')}
    </p>
  </div>`)
}

function Verify() {
  const sent = S.sent
  return AuthShell('student', `<div class="rounded-[28px] bg-white p-7 shadow-[0_24px_70px_rgba(24,36,64,.09)] sm:p-9">
    ${Link('/student-login', 'mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#667085]', `${Icon('ArrowLeft', { size: 15 })} Back to login`)}
    <div class="grid size-12 place-items-center rounded-2xl bg-[#edf1ff] text-[#4263eb]">${Icon('ShieldCheck', { size: 24 })}</div>
    <h2 class="mt-5 text-3xl font-bold tracking-[-.04em] text-[#121b2b]">Verify your college ID</h2>
    <p class="mt-2 text-sm leading-6 text-[#667085]">We’ll match your enrollment details and send a one-time code to your registered college email.</p>
    <div class="mt-7 grid gap-4">
      ${Field('Enrollment Number', 'CC2024CS1042', 'GraduationCap', 'text', 'enrollment')}
      ${Field('College Email ID', 'you@campus.edu', 'Mail', 'email', 'email')}
    </div>
    ${sent ? `<div class="mt-5 rounded-xl border border-[#b7e3c8] bg-[#f0fbf4] p-4">
      <p class="flex items-center gap-2 text-xs font-bold text-[#147a3d]">${Icon('CheckCircle2', { size: 16 })} OTP sent to ${esc(S.maskedEmail)}</p>
      ${S.devOtp ? `<p class="mt-2 text-[11px] text-[#147a3d]">Development mode – your code is <b>${esc(S.devOtp)}</b> (it is also printed in the server console).</p>` : ''}
      <div class="mt-4 grid grid-cols-6 gap-2">
        ${[1, 2, 3, 4, 5, 6].map(() => `<input data-otp maxlength="1" inputmode="numeric" class="h-11 rounded-lg border border-[#cbd5e1] text-center font-bold outline-none focus:border-[#4263eb]">`).join('')}
      </div>
      <div class="mt-4">${Field('Create a password', 'At least 8 characters', 'LockKeyhole', 'password', 'newPassword')}</div>
    </div>` : ''}
    ${FormMsg()}
    <button data-action="${sent ? 'verify-otp' : 'send-otp'}" class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4263eb] text-sm font-bold text-white">
      ${sent ? 'Verify &amp; create account' : 'Send verification code'} ${Icon('ArrowRight', { size: 16 })}
    </button>
    <p class="mt-5 text-center text-[11px] leading-5 text-[#98a2b3]">By continuing, you agree to the CampusConnect Terms and acknowledge the student privacy policy.</p>
  </div>`)
}

function AdminLogin() {
  return AuthShell('admin', `<div class="rounded-[28px] border border-white/10 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,.25)] sm:p-10">
    <span class="inline-flex items-center gap-2 text-xs font-bold text-[#4263eb]">${Icon('LockKeyhole', { size: 15 })} SECURE ADMIN PORTAL</span>
    <h2 class="mt-4 text-3xl font-bold tracking-[-.04em] text-[#121b2b]">Administrator login</h2>
    <p class="mt-2 text-sm leading-6 text-[#667085]">Restricted to authorised college administrators and event organisers.</p>
    <div class="mt-8 grid gap-5">
      ${Field('Admin Email', 'admin@campus.edu', 'Mail', 'email', 'email')}
      ${Field('Password', 'Enter your secure password', 'LockKeyhole', 'password', 'password')}
    </div>
    <div class="mt-4 text-right"><button class="text-xs font-bold text-[#4263eb]">Forgot password?</button></div>
    ${FormMsg()}
    <button data-action="admin-login" class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#121b2b] text-sm font-bold text-white hover:bg-[#4263eb]">Secure Login ${Icon('ShieldCheck', { size: 16 })}</button>
    <div class="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#98a2b3]">${Icon('LockKeyhole', { size: 12 })} Protected with encrypted administrator access</div>
  </div>`)
}

function Dashboard() {
  const featured = events.filter((e) => e.featured)
  const f = featured[0]
  const tints = ['bg-blue-50 text-blue-600', 'bg-purple-50 text-purple-600', 'bg-green-50 text-green-600', 'bg-amber-50 text-amber-600']
  return `${StudentHeader()}
  <main class="min-h-screen bg-[#f7f8fc]">
    <section class="mx-auto max-w-[1440px] px-5 py-9 lg:px-8">
      <div class="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p class="text-sm font-semibold text-[#4263eb]">${todayLabel()}</p>
          <h1 class="mt-1 text-3xl font-bold tracking-[-.04em] text-[#121b2b] sm:text-4xl">Hey, ${esc(firstName())}! <span aria-hidden="true">👋</span></h1>
          <p class="mt-2 text-sm text-[#667085]">Your campus has plenty in store for you this week.</p>
        </div>
        <div class="relative w-full lg:max-w-md">
          ${Icon('Search', { size: 18, cls: 'absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]' })}
          <input placeholder="Search events, categories or clubs..." class="h-13 w-full rounded-2xl border border-[#e2e6ed] bg-white pl-12 pr-4 text-sm outline-none focus:border-[#4263eb]">
        </div>
      </div>
      ${f ? `<div class="relative mt-8 min-h-[340px] overflow-hidden rounded-[28px] bg-[#121b2b] shadow-[0_25px_70px_rgba(24,34,56,.2)]">
        ${Img(f.image, f.imageAlt, 'object-cover opacity-65')}
        <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,20,34,.96)_0%,rgba(12,20,34,.72)_48%,rgba(12,20,34,.08)_100%)]"></div>
        <div class="relative z-10 flex min-h-[340px] max-w-2xl flex-col justify-center p-8 sm:p-12">
          <span class="w-fit rounded-full bg-[#8b5cf6] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-white">Featured this week</span>
          <h2 class="mt-5 text-3xl font-bold tracking-[-.04em] text-white sm:text-5xl">${esc(f.title)}</h2>
          <p class="mt-4 line-clamp-2 max-w-xl text-sm leading-6 text-white/68">${esc(f.description)}</p>
          <div class="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-white/80">
            <span class="flex items-center gap-2">${Icon('CalendarDays', { size: 15 })} ${fmtMonDay(f.startDate)}</span>
            <span class="flex items-center gap-2">${Icon('MapPin', { size: 15 })} ${esc(f.venue)}</span>
            <span class="flex items-center gap-2">${Icon('UsersRound', { size: 15 })} ${f.availableSeats} spots left</span>
          </div>
          <div class="mt-7 flex gap-3">
            ${Link('/events/' + f.slug, 'flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-[#121b2b]', `Reserve your spot ${Icon('ArrowRight', { size: 15 })}`)}
            <button class="grid size-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-white">${Icon('Bookmark', { size: 17 })}</button>
          </div>
        </div>
      </div>` : ''}
      <div class="mt-10 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-[-.03em] text-[#121b2b]">Explore by category</h2>
          <p class="mt-1 text-xs text-[#98a2b3]">Find events that match your energy</p>
        </div>
      </div>
      <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        ${categories.slice(1).map((c, i) => Link('/explore?category=' + c, 'group rounded-2xl border border-[#e5e8ef] bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-[#4263eb]/30 hover:shadow-md',
          `<span class="mx-auto mb-3 grid size-10 place-items-center rounded-xl ${tints[i % 4]}">${Icon('Sparkles', { size: 18 })}</span>
          <span class="text-[11px] font-bold text-[#344054]">${c}</span>`)).join('')}
      </div>
      <div class="mt-11 flex items-end justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-[-.03em] text-[#121b2b]">Upcoming events</h2>
          <p class="mt-1 text-xs text-[#98a2b3]">Popular around your campus right now</p>
        </div>
        ${Link('/explore', 'flex items-center gap-1 text-xs font-bold text-[#4263eb]', `View all ${Icon('ArrowRight', { size: 14 })}`)}
      </div>
      <div class="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        ${events.slice(0, 4).map((e) => EventCard(e, true)).join('')}
      </div>
    </section>
  </main>`
}

function Explore() {
  const shown = events.filter(
    (e) =>
      (S.category === 'All Events' || e.category === S.category) &&
      (!S.onlySaved || D.saved.includes(e.id)) &&
      `${e.title} ${e.organiser} ${e.category}`.toLowerCase().includes(S.query.toLowerCase()),
  )
  return `${StudentHeader('Explore Events')}
  <main class="min-h-screen bg-[#f7f8fc]">
    <section class="mx-auto max-w-[1440px] px-5 py-9 lg:px-8">
      ${PageTitle('Discover', 'Explore campus events', 'New ideas, new people and new experiences—all waiting for you.',
        `<button class="flex h-11 items-center gap-2 rounded-xl border border-[#dfe3eb] bg-white px-4 text-xs font-bold text-[#344054]">${Icon('ListFilter', { size: 16 })} Filters</button>`)}
      <div class="rounded-[20px] border border-[#e5e8ef] bg-white p-3">
        <div class="relative">
          ${Icon('Search', { size: 19, cls: 'absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]' })}
          <input data-bind="query" value="${esc(S.query)}" placeholder="Search by event, club or category..." class="h-12 w-full rounded-xl bg-[#f7f8fc] pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#4263eb]/20">
        </div>
        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          ${categories.map((c) => `<button data-action="set-category" data-value="${c}" class="shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${S.category === c ? 'bg-[#121b2b] text-white' : 'bg-[#f7f8fc] text-[#667085] hover:text-[#121b2b]'}">${c}</button>`).join('')}
        </div>
      </div>
      <div class="mt-8 flex items-center justify-between">
        <p class="text-sm font-bold text-[#121b2b]">${shown.length} events available</p>
        <button class="flex items-center gap-2 text-xs font-semibold text-[#667085]">Sort by: <b class="text-[#121b2b]">Upcoming</b>${Icon('ChevronDown', { size: 14 })}</button>
      </div>
      ${shown.length
        ? `<div class="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">${shown.map((e) => EventCard(e)).join('')}</div>`
        : `<div class="mt-5">${EmptyEvents()}</div>`}
    </section>
  </main>`
}

function EventDetail() {
  const event = currentEvent()
  if (!event) return StudentHeader('Explore Events') + `<main class="min-h-screen bg-[#f7f8fc]"><section class="mx-auto max-w-[1320px] px-5 py-9">${EmptyEvents()}</section></main>`
  const soldOut = event.availableSeats === 0
  const mine = myReg(event.id)
  const closed = event.status !== 'published'
  const saved = D.saved.includes(event.id)
  return `${StudentHeader('Explore Events')}
  <main class="min-h-screen bg-[#f7f8fc]">
    <section class="mx-auto max-w-[1320px] px-5 py-7 lg:px-8">
      ${Link('/explore', 'mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#667085]', `${Icon('ArrowLeft', { size: 15 })} Back to all events`)}
      <div class="relative h-[320px] overflow-hidden rounded-[28px] sm:h-[460px]">
        ${Img(event.image, event.imageAlt, 'object-cover')}
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d1627]/85 via-transparent to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
          <span class="rounded-full bg-[#4263eb] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em]">${esc(event.category)}</span>
          <h1 class="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl">${esc(event.title)}</h1>
          <p class="mt-3 text-sm text-white/70">Hosted by ${esc(event.organiser)}</p>
        </div>
      </div>
      <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="space-y-6">
          <div class="rounded-[22px] border border-[#e5e8ef] bg-white p-7">
            <h2 class="text-lg font-bold text-[#121b2b]">About this event</h2>
            <p class="mt-3 text-sm leading-7 text-[#667085]">${esc(event.description)} Meet fellow students who share your curiosity, learn directly from experienced mentors and leave with ideas you can put into action.</p>
            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              ${Info('CalendarDays', 'Date &amp; time', fmtLong(event.startDate))}
              ${Info('MapPin', 'Venue', esc(event.venue))}
              ${Info('UsersRound', 'Organised by', esc(event.organiser))}
              ${Info('UserRound', 'Coordinator', `${esc(event.coordinatorName)} • ${esc(event.coordinatorEmail)}`)}
            </div>
          </div>
          <div class="grid gap-6 md:grid-cols-2">
            ${TextPanel('Eligibility criteria', event.eligibility, 'ShieldCheck')}
            ${TextPanel('Rules &amp; guidelines', event.rules, 'ListFilter')}
          </div>
        </div>
        <aside class="h-fit rounded-[24px] border border-[#e4e8ef] bg-white p-6 shadow-[0_18px_55px_rgba(20,30,55,.08)] lg:sticky lg:top-24">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#667085]">Registration fee</span>
            <b class="text-xl text-[#121b2b]">${event.fee ? `₹${event.fee}` : 'Free'}</b>
          </div>
          <div class="my-5 h-px bg-[#edf0f4]"></div>
          <p class="text-xs font-semibold text-[#667085]">Seat availability</p>
          <div class="mt-2 flex items-end justify-between">
            <span><b class="text-2xl text-[#121b2b]">${event.availableSeats}</b><small class="text-[#98a2b3]"> / ${event.maxParticipants} left</small></span>
            <span class="rounded-full px-2.5 py-1 text-[10px] font-bold ${soldOut ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}">${soldOut ? 'Sold out' : 'Filling fast'}</span>
          </div>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-[#edf0f5]">
            <div class="h-full rounded-full bg-[#4263eb]" style="width:${Math.max(4, (event.availableSeats / event.maxParticipants) * 100)}%"></div>
          </div>
          <div class="mt-5 rounded-xl bg-[#f7f8fc] p-4 text-xs leading-5 text-[#667085]"><b class="block text-[#344054]">Registration closes</b>${fmtDeadline(event.registrationDeadline)}</div>
          ${closed
            ? `<div class="mt-5 flex h-12 items-center justify-center rounded-xl bg-[#edf0f5] text-sm font-bold text-[#667085]">Registration closed</div>`
            : mine
              ? Link('/registrations', 'mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-green-50 text-sm font-bold text-green-700', `${Icon('CheckCircle2', { size: 16 })} ${mine.status === 'waitlist' ? 'You’re on the waitlist' : 'You’re registered'}`)
              : Link('/register/' + event.slug, 'mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4263eb] text-sm font-bold text-white shadow-[0_10px_25px_rgba(66,99,235,.25)]', `${soldOut ? 'Join Waitlist' : 'Register Now'} ${Icon('ArrowRight', { size: 16 })}`)}
          <button data-action="save" data-key="${event.id}" class="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3ea] text-xs font-bold text-[#344054]">${Icon(saved ? 'BookmarkCheck' : 'Bookmark', { size: 15 })} ${saved ? 'Saved' : 'Save for later'}</button>
          <p class="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#98a2b3]">${Icon('ShieldCheck', { size: 12 })} Verified campus-only registration</p>
        </aside>
      </div>
    </section>
  </main>`
}

function Register() {
  const event = currentEvent()
  if (!event) return StudentHeader() + `<main class="min-h-screen bg-[#f7f8fc]"><section class="mx-auto max-w-[1100px] px-5 py-9">${EmptyEvents()}</section></main>`
  const me = D.me || {}
  const step = (n, t, mb) => `<div class="${mb} flex items-center gap-3"><span class="grid size-8 place-items-center rounded-full bg-[#4263eb] text-xs font-bold text-white">${n}</span><h2 class="font-bold text-[#121b2b]">${t}</h2></div>`
  return `${StudentHeader()}
  <main class="min-h-screen bg-[#f7f8fc]">
    <section class="mx-auto max-w-[1100px] px-5 py-8">
      <div class="mb-7 flex items-center gap-3">
        ${Link('/events/' + event.slug, 'grid size-10 place-items-center rounded-xl border border-[#dfe3ea] bg-white', Icon('ArrowLeft', { size: 17 }))}
        <div>
          <h1 class="text-2xl font-bold tracking-[-.03em] text-[#121b2b]">Complete your registration</h1>
          <p class="text-xs text-[#667085]">Your spot is held for the next 09:42 minutes</p>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div class="space-y-5">
          <div class="rounded-[22px] border border-[#e5e8ef] bg-white p-6">
            ${step(1, 'Student details', 'mb-6')}
            <div class="grid gap-4 sm:grid-cols-2">
              ${Field('Full name', 'Aarav Sharma', '', 'text', 'name', me.name || '')}
              ${Field('Enrollment number', 'CC2024CS1042', '', 'text', 'enrollment', me.enrollment || '')}
              ${Field('College email', 'aarav@campus.edu', '', 'text', 'email', me.email || '')}
              ${Field('Phone number', '+91 98765 43210', '', 'text', 'phone', me.phone || '')}
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              ${Field('Department', 'Computer Science', '', 'text', 'department', me.department || '')}
              ${Field('Year of study', 'Third year', '', 'text', 'year', me.year || '')}
            </div>
          </div>
          <div class="rounded-[22px] border border-[#e5e8ef] bg-white p-6">
            ${step(2, 'Terms &amp; confirmation', 'mb-5')}
            <label class="flex gap-3 rounded-xl bg-[#f7f8fc] p-4">
              <input type="checkbox" name="terms" checked class="mt-0.5 accent-[#4263eb]">
              <span class="text-xs leading-5 text-[#667085]">I confirm that the details provided are correct and agree to follow the event rules, venue guidelines and cancellation policy.</span>
            </label>
            ${FormMsg()}
            <button data-action="register" data-slug="${event.slug}" class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4263eb] text-sm font-bold text-white">${event.availableSeats ? 'Confirm Registration' : 'Join Waitlist'} ${Icon('CheckCircle2', { size: 17 })}</button>
          </div>
        </div>
        <aside class="h-fit rounded-[22px] border border-[#e5e8ef] bg-white p-5 lg:sticky lg:top-24">
          <div class="relative h-40 overflow-hidden rounded-2xl">${Img(event.image, event.imageAlt, 'object-cover')}</div>
          <p class="mt-4 text-[10px] font-bold uppercase tracking-[.1em] text-[#4263eb]">${esc(event.category)}</p>
          <h3 class="mt-1 font-bold text-[#121b2b]">${esc(event.title)}</h3>
          <div class="mt-4 grid gap-2 text-xs text-[#667085]">
            <span class="flex gap-2">${Icon('CalendarDays', { size: 14 })} ${fmtShort(event.startDate)}</span>
            <span class="flex gap-2">${Icon('MapPin', { size: 14 })} ${esc(event.venue)}</span>
          </div>
          <div class="my-5 h-px bg-[#edf0f4]"></div>
          <div class="flex justify-between text-sm"><span class="text-[#667085]">Registration fee</span><b>${event.fee ? `₹${event.fee}` : 'Free'}</b></div>
          <div class="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-[11px] font-semibold text-green-700">${Icon('ShieldCheck', { size: 15 })} Secure student registration</div>
        </aside>
      </div>
    </section>
  </main>`
}

function Success() {
  const event = D.reg?.event
  const regId = D.reg?.regId || ''
  const waitlist = D.reg?.status === 'waitlist'
  return `<main class="min-h-screen bg-[radial-gradient(circle_at_top,#eaf0ff,#f7f8fc_45%)] px-5 py-10">
    <div class="mx-auto max-w-[680px]">
      <div class="mb-8 flex justify-center">${Logo()}</div>
      <div class="overflow-hidden rounded-[28px] border border-[#e1e6f0] bg-white text-center shadow-[0_28px_80px_rgba(34,48,85,.14)]">
        <div class="bg-[#121b2b] px-7 py-8 text-white">
          <span class="mx-auto grid size-14 place-items-center rounded-full bg-[#22c55e] shadow-[0_0_0_8px_rgba(34,197,94,.14)]">${Icon('Check', { size: 28, strokeWidth: 3 })}</span>
          <h1 class="mt-5 text-3xl font-bold tracking-[-.04em]">${waitlist ? 'You’re on the waitlist!' : 'You’re on the list!'}</h1>
          <p class="mt-2 text-sm text-white/60">${waitlist ? 'We’ll confirm your spot automatically if a seat opens up.' : 'Your registration is confirmed and your pass is ready.'}</p>
        </div>
        <div class="p-7 sm:p-9">
          <p class="text-xs font-bold uppercase tracking-[.12em] text-[#4263eb]">${esc(event?.category ?? 'Technical')}</p>
          <h2 class="mt-2 text-xl font-bold text-[#121b2b]">${esc(event?.title ?? 'Aurora Tech Summit 2026')}</h2>
          <div class="mt-6 flex justify-center">${QRPattern()}</div>
          <p class="mt-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#98a2b3]">Registration ID</p>
          <p class="mt-1 font-mono text-sm font-bold text-[#121b2b]">${esc(regId)}</p>
          <div class="mt-7 grid gap-3 rounded-2xl bg-[#f7f8fc] p-5 text-left sm:grid-cols-2">
            ${Info('CalendarDays', 'Date &amp; time', event ? fmtShort(event.startDate) : '')}
            ${Info('MapPin', 'Venue', esc(event?.venue ?? 'Innovation Auditorium'))}
          </div>
          <p class="mt-5 text-xs leading-5 text-[#667085]">Show this QR pass at the event entrance. We’ve also sent a confirmation to your college email.</p>
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <button class="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe3eb] text-xs font-bold text-[#344054]">${Icon('Download', { size: 15 })} Download pass</button>
            ${Link('/registrations', 'flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4263eb] text-xs font-bold text-white', `My Registrations ${Icon('ArrowRight', { size: 15 })}`)}
          </div>
        </div>
      </div>
    </div>
  </main>`
}

function Registrations() {
  const tab = S.tab
  const now = new Date().toISOString()
  const list = D.regs.filter((r) =>
    tab === 'Cancelled' ? r.status === 'cancelled'
    : tab === 'Completed' ? r.status === 'confirmed' && r.event.endDate < now
    : r.status !== 'cancelled' && r.event.endDate >= now)
  return `${StudentHeader('My Registrations')}
  <main class="min-h-screen bg-[#f7f8fc]">
    <section class="mx-auto max-w-[1200px] px-5 py-9">
      ${PageTitle('Your passes', 'My registrations', 'Everything you’ve reserved, attended or cancelled—in one place.')}
      <div class="flex gap-2 border-b border-[#e1e5ec]">
        ${['Upcoming', 'Completed', 'Cancelled'].map((t) => `<button data-action="set-tab" data-value="${t}" class="relative px-5 py-3 text-xs font-bold ${tab === t ? 'text-[#4263eb]' : 'text-[#667085]'}">${t}${tab === t ? '<span class="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#4263eb]"></span>' : ''}</button>`).join('')}
      </div>
      ${list.length
        ? `<div class="mt-6 grid gap-5">${list.map((r) => { const e = r.event; return `<div class="grid overflow-hidden rounded-[22px] border border-[#e5e8ef] bg-white shadow-sm md:grid-cols-[230px_1fr_auto]">
          <div class="relative min-h-44">${Img(e.image, e.imageAlt, 'object-cover')}</div>
          <div class="p-6">
            ${r.status === 'waitlist'
              ? `<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">${Icon('Clock3', { size: 12 })} Waitlisted</span>`
              : r.status === 'cancelled'
                ? `<span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">${Icon('X', { size: 12 })} Cancelled</span>`
                : `<span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">${Icon('CheckCircle2', { size: 12 })} Confirmed</span>`}
            <h3 class="mt-3 text-lg font-bold text-[#121b2b]">${esc(e.title)}</h3>
            <div class="mt-3 flex flex-wrap gap-4 text-xs text-[#667085]">
              <span class="flex gap-2">${Icon('CalendarDays', { size: 14 })} ${fmtShort(e.startDate)}</span>
              <span class="flex gap-2">${Icon('MapPin', { size: 14 })} ${esc(e.venue)}</span>
            </div>
            <p class="mt-4 text-[10px] font-semibold text-[#98a2b3]">REG ID <b class="ml-1 text-[#344054]">${esc(r.regId)}</b></p>
          </div>
          <div class="flex items-center gap-2 border-t border-[#edf0f4] p-5 md:border-l md:border-t-0">
            ${r.status !== 'cancelled' ? Link('/registration-success?reg=' + r.regId, 'grid size-11 place-items-center rounded-xl bg-[#121b2b] text-white', Icon('QrCode', { size: 19 })).replace('.html?reg=', '.html?reg=') : ''}
            ${Link('/events/' + e.slug, 'grid h-11 place-items-center rounded-xl border border-[#dfe3eb] px-4 text-xs font-bold text-[#344054]', 'View details')}
            ${r.status !== 'cancelled' && e.endDate >= now ? `<button data-action="cancel-reg" data-reg="${esc(r.regId)}" class="h-11 rounded-xl border border-red-200 px-4 text-xs font-bold text-red-600">Cancel</button>` : ''}
          </div>
        </div>` }).join('')}</div>`
        : `<div class="mt-6 rounded-[22px] border border-dashed border-[#cfd5e0] bg-white py-16 text-center">
          ${Icon('TicketCheck', { size: 34, cls: 'mx-auto text-[#98a2b3]' })}
          <h3 class="mt-3 font-bold text-[#121b2b]">No ${tab.toLowerCase()} registrations</h3>
          <p class="mt-1 text-xs text-[#667085]">Your ${tab.toLowerCase()} events will appear here.</p>
        </div>`}
    </section>
  </main>`
}

function Profile() {
  const me = D.me || {}
  const edit = S.editProfile
  const item = (label, value, name) => edit && name
    ? `<div><small class="block text-[10px] font-bold uppercase tracking-[.08em] text-[#98a2b3]">${label}</small><input name="${name}" value="${esc(value)}" class="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5ed] px-3 text-sm font-semibold text-[#344054] outline-none focus:border-[#4263eb]"></div>`
    : ProfileItem(label, esc(value))
  return `${StudentHeader('Profile')}
  <main class="min-h-screen bg-[#f7f8fc]">
    <section class="mx-auto max-w-[1080px] px-5 py-9">
      ${PageTitle('Account', 'Student profile', 'Keep your campus identity and preferences up to date.')}
      <div class="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside class="h-fit rounded-[22px] border border-[#e5e8ef] bg-white p-6 text-center">
          <span class="mx-auto grid size-24 place-items-center rounded-[26px] bg-[linear-gradient(135deg,#dce3ff,#eadcff)] text-2xl font-extrabold text-[#4263eb]">${esc(initialsOf(me.name))}</span>
          <h2 class="mt-4 text-lg font-bold text-[#121b2b]">${esc(me.name)}</h2>
          <p class="mt-1 text-xs text-[#667085]">${esc(me.department)} • ${esc(yearShort(me.year))}</p>
          <span class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-700">${Icon('ShieldCheck', { size: 13 })} College ID verified</span>
          <div class="mt-6 grid grid-cols-2 gap-2">
            <div class="rounded-xl bg-[#f7f8fc] p-3"><b class="block text-lg text-[#121b2b]">${pad2(D.regs.filter((r) => r.status !== 'cancelled').length)}</b><small class="text-[10px] text-[#98a2b3]">Registered</small></div>
            <div class="rounded-xl bg-[#f7f8fc] p-3"><b class="block text-lg text-[#121b2b]">${pad2(D.saved.length)}</b><small class="text-[10px] text-[#98a2b3]">Saved</small></div>
          </div>
          <button data-action="logout" class="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3eb] text-xs font-bold text-[#344054]">${Icon('LogOut', { size: 14 })} Log out</button>
        </aside>
        <div class="space-y-5">
          <div class="rounded-[22px] border border-[#e5e8ef] bg-white p-6">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-[#121b2b]">Personal information</h3>
              ${edit
                ? `<span class="flex gap-3"><button data-action="profile-cancel" class="text-xs font-bold text-[#667085]">Cancel</button><button data-action="profile-save" class="flex items-center gap-2 text-xs font-bold text-[#4263eb]">${Icon('Check', { size: 14 })} Save</button></span>`
                : `<button data-action="profile-edit" class="flex items-center gap-2 text-xs font-bold text-[#4263eb]">${Icon('FilePenLine', { size: 14 })} Edit</button>`}
            </div>
            ${FormMsg()}
            <div class="mt-6 grid gap-5 sm:grid-cols-2">
              ${item('Full name', me.name || '', 'name')}
              ${item('Enrollment number', me.enrollment || '')}
              ${item('College email', me.email || '')}
              ${item('Phone number', me.phone || '', 'phone')}
              ${item('Department', me.department || '', 'department')}
              ${item('Year of study', me.year || '', 'year')}
            </div>
          </div>
          <div class="rounded-[22px] border border-[#e5e8ef] bg-white p-6">
            <h3 class="font-bold text-[#121b2b]">Event interests</h3>
            <div class="mt-4 flex flex-wrap gap-2">
              ${(me.interests || []).map((c) => `<span class="rounded-full bg-[#edf1ff] px-3 py-2 text-xs font-bold text-[#4263eb]">${esc(c)}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>`
}
