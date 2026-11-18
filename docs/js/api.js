/* Tiny API client. Stores the JWT in localStorage and sends it as a Bearer token. */
const API = {
  get token() { return localStorage.getItem('cc_token') },
  get role() { return localStorage.getItem('cc_role') },
  login(token, role) { localStorage.setItem('cc_token', token); localStorage.setItem('cc_role', role) },
  clear() { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_role') },

  async request(method, url, body) {
    const headers = { 'Content-Type': 'application/json' }
    if (this.token) headers.Authorization = 'Bearer ' + this.token
    const res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
    let data = {}
    try { data = await res.json() } catch (_) {}
    if (!res.ok) {
      const err = new Error(data.error || 'Request failed (' + res.status + ')')
      err.status = res.status
      throw err
    }
    return data
  },
  get(url) { return this.request('GET', url) },
  post(url, body) { return this.request('POST', url, body || {}) },
  put(url, body) { return this.request('PUT', url, body || {}) },
  del(url) { return this.request('DELETE', url) },
}
