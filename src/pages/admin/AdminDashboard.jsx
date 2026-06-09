import React, { useEffect, useState } from 'react'
import PendingBuses from './PendingBuses'
import ApprovedBuses from './ApprovedBuses'
import Analytics from './Analytics'
import '../Home.css'

export default function AdminDashboard() {
  const [auth, setAuth] = useState(null)
  const [route, setRoute] = useState(() => window.location.hash || '#/admin')

  const getDisplayName = (a) => {
    if (!a) return ''
    const n = a.name || a.email || ''
    if (!n) return ''
    if (n.includes('@')) {
      const local = n.split('@')[0]
      return local.replace(/[.\-_]/g, ' ').split(' ').map(s => s ? (s.charAt(0).toUpperCase() + s.slice(1)) : '').join(' ')
    }
    return n
  }

  useEffect(() => {
    const a = JSON.parse(localStorage.getItem('adminAuth') || 'null')
    if (!a) {
      window.location.hash = '#/login'
      return
    }
    setAuth(a)

    const onHash = () => setRoute(window.location.hash || '#/admin')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.hash = '#/login'
  }

  if (!auth) return null

  let content = null
  if (route.startsWith('#/admin/pending')) content = <PendingBuses />
  else if (route.startsWith('#/admin/approved')) content = <ApprovedBuses />
  else if (route.startsWith('#/admin/analytics')) content = <Analytics />
  else content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <h2>Welcome, {getDisplayName(auth)}</h2>
      <p>This is the admin area. Use the left menu to navigate admin functions.</p>
      <img src="/images/about.png" alt="Welcome" style={{ maxWidth: '60%', height: 'auto', marginTop: 24, borderRadius: 8, boxShadow: '0 8px 24px rgba(2,6,23,0.12)' }} />
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header style={{ background: '#fbbf24', padding: 16, color: '#0b172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20 }}>RouteLK admin dashboard</div>
        <div>
          <span style={{ marginRight: 12 }}>{getDisplayName(auth)}</span>
          <button className="btn outline" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: 240, background: '#0f172a', color: '#fff', padding: 20 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="#/" style={{ color: '#ffd966', textDecoration: 'none', fontWeight: 700 }}>Home</a>
            <a href="#/admin/pending" style={{ color: '#fff', textDecoration: 'none' }}>Pending Busses</a>
            <a href="#/admin/approved" style={{ color: '#fff', textDecoration: 'none' }}>Registered Busses</a>
            <a href="#/admin/analytics" style={{ color: '#fff', textDecoration: 'none' }}>Analytics</a>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 24, background: '#f3f4f6' }}>
          {content}
        </main>
      </div>
    </div>
  )
}
