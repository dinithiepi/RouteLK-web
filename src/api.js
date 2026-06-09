const API = import.meta.env.VITE_API_URL || 'https://grcwv997gb.execute-api.eu-north-1.amazonaws.com/prod';
const ADMIN_API = 'https://eutls380fb.execute-api.eu-north-1.amazonaws.com/prod';// ── Auth ──────────────────────────────────────────

export async function adminLogin(email, password) {
  const res = await fetch(`${ADMIN_API}/adminLogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    mode: 'cors',
  });
  return handleResponse(res);
}

export async function adminRegister(adminData) {
  const res = await fetch(`${ADMIN_API}/adminRegister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: adminData.fullName,
      email: adminData.governmentEmail,
      password: adminData.password
    }),
    mode: 'cors',
  });
  return handleResponse(res);
}

export async function adminVerifyOTP(email, otp) {
  const res = await fetch(`${ADMIN_API}/adminVerifyOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
    mode: 'cors',
  });
  return handleResponse(res);
}

// ── Bus Management ────────────────────────────────

export async function getPendingBuses() {
  const url = `${API}/buses/pending`
  console.debug('[api] GET', url)
  const res = await fetch(url, { mode: 'cors' });
  let data = await handleResponse(res)
  console.debug('[api] response', url, res.status, data)
  if (data && typeof data.body === 'string') {
    try { data = JSON.parse(data.body) } catch (e) { /* keep original */ }
  }
  return normalizeBuses(data)
}

export async function getApprovedBuses() {
  const url = `${API}/buses/approved`
  console.debug('[api] GET', url)
  const res = await fetch(url, { mode: 'cors' });
  let data = await handleResponse(res)
  console.debug('[api] response', url, res.status, data)
  if (data && typeof data.body === 'string') {
    try { data = JSON.parse(data.body) } catch (e) { /* keep original */ }
  }
  return normalizeBuses(data)
}

export async function approveBus(busId) {
  const res = await fetch(`${API}/buses/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ busId }),
    mode: 'cors',
  });
  return handleResponse(res);
}

export async function rejectBus(busId) {
  const res = await fetch(`${API}/buses/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ busId }),
    mode: 'cors',
  });
  return handleResponse(res);
}

// ── Helpers ───────────────────────────────────────

async function handleResponse(res) {
  if (res.status === 204) return null;
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    const txt = await res.text();
    data = txt || null;
  }
  if (data && typeof data.body === 'string') {
    try { data = JSON.parse(data.body); } catch (e) { /* keep original */ }
  }
  if (!res.ok) {
    const msg = (data && data.error) || (data && data.message) || res.statusText || 'API error';
    throw new Error(msg);
  }
  return data;
}

function normalizeBuses(data) {
  const arr = Array.isArray(data) ? data : (data && data.buses) || [];
  return arr.map((b) => ({
    bus_id:      b.bus_id || b.id || null,
    bus_number:  b.bus_number || b.plate || '',
    route:       b.route || '',
    owner_nic:   b.owner_nic || b.ownerId || '',
    bus_type:    b.bus_type || '',
    total_seats: b.total_seats || null,
    contact_no:  b.contact_no || '',
    approved:    b.approved || false,
    created_at:  b.created_at || null,
  }));
}