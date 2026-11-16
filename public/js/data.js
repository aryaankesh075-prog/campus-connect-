/*
 * Live data. In the React app this came from the Payload CMS; here main.js loads it from the
 * Express API (see server/server.js) before the first render.
 */
let events = []
const D = {
  me: null, // logged-in student / admin
  regs: [], // my registrations (student)
  saved: [], // ids of saved events (student)
  reg: null, // single registration (success page)
  stats: null, // admin dashboard numbers
  adminRegs: [], // all registrations (admin)
  students: [], // all verified students (admin)
  editEvent: null, // event being edited (admin)
}
