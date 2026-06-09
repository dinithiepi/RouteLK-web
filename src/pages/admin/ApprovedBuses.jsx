import React, { useEffect, useState } from 'react'
import { getApprovedBuses, rejectBus } from '../../api'

export default function ApprovedBuses() {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getApprovedBuses()
      setBuses(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load approved buses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (bus) => {
    if (!window.confirm('Are you sure you want to remove this bus?')) return
    const id = bus.bus_id || bus.id
    try {
      await rejectBus(id)
      // persist a local record of rejected buses so analytics can show counts
      try {
        const existing = JSON.parse(localStorage.getItem('rejected_buses') || '[]')
        existing.push({
          id,
          bus_number: bus.bus_number || bus.plate || '',
          route: bus.route || '',
          owner_nic: bus.owner_nic || bus.ownerId || '',
          rejected_at: new Date().toISOString(),
        })
        localStorage.setItem('rejected_buses', JSON.stringify(existing))
      } catch (e) {
        // ignore localStorage failures
      }
      load() // refresh list from DB
    } catch (e) {
      alert('Failed to remove bus: ' + e.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h2>Registered Buses</h2>
      <p>Approved buses in the system.</p>
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
                    className="btn outline"
                    onClick={() => remove(b)}
                    style={{ color: 'red' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {buses.length === 0 && (
          <div style={{ padding: 12 }}>No approved buses.</div>
        )}
      </div>
    </div>
  )
}