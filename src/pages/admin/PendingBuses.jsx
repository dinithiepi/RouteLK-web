import React, { useEffect, useState } from 'react'
import { getPendingBuses, approveBus } from '../../api'

export default function PendingBuses() {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getPendingBuses()
      setBuses(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load pending buses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async (busId) => {
    try {
      await approveBus(busId)
      // remove any local rejected record for this bus (if present)
      try {
        const arr = JSON.parse(localStorage.getItem('rejected_buses') || '[]')
        const filtered = arr.filter((r) => r.id !== busId)
        if (filtered.length !== arr.length) localStorage.setItem('rejected_buses', JSON.stringify(filtered))
      } catch (e) { /* ignore localStorage errors */ }
      load() // refresh list from DB
    } catch (e) {
      alert('Failed to approve bus: ' + e.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h2>Pending Buses</h2>
      <p>Approve registered buses below.</p>
      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: 8 }}>Bus Number</th>
              <th style={{ padding: 8 }}>Route</th>
              <th style={{ padding: 8 }}>Owner NIC</th>
              <th style={{ padding: 8 }}>Bus Type</th>
              <th style={{ padding: 8 }}>Total Seats</th>
              <th style={{ padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((b) => (
              <tr key={b.bus_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: 8 }}>{b.bus_number}</td>
                <td style={{ padding: 8 }}>{b.route}</td>
                <td style={{ padding: 8 }}>{b.owner_nic}</td>
                <td style={{ padding: 8 }}>{b.bus_type}</td>
                <td style={{ padding: 8 }}>{b.total_seats}</td>
                <td style={{ padding: 8 }}>
                  <button
                    className="btn primary"
                    onClick={() => approve(b.bus_id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && (
          <div style={{ padding: 12 }}>No pending buses.</div>
        )}
      </div>
    </div>
  )
}