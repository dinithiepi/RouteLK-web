import React, { useEffect, useState } from 'react'
import { getApprovedBuses, getPendingBuses } from '../../api'

function getTopRoutes(buses, top = 5) {
  const counts = {}
  buses.forEach((b) => {
    const isApproved = b.status === 'approved' || b.approved === true
    if (!isApproved) return
    counts[b.route] = (counts[b.route] || 0) + 1
  })
  const arr = Object.keys(counts).map((r) => ({ route: r, count: counts[r] }))
  arr.sort((a, b) => b.count - a.count)
  return arr.slice(0, top)
}

export default function Analytics() {
  const [buses, setBuses] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [approvedData, pendingData] = await Promise.all([getApprovedBuses(), getPendingBuses()])
        const approvedList = Array.isArray(approvedData) ? approvedData : (approvedData && approvedData.buses) || []
        const pendingList = Array.isArray(pendingData) ? pendingData : (pendingData && pendingData.buses) || []
        // merge by bus_id/ id - prefer approvedList values for approved flags
        const map = new Map()
        pendingList.forEach((b) => {
          const id = b.bus_id || b.id || null
          map.set(id || JSON.stringify(b), b)
        })
        approvedList.forEach((b) => {
          const id = b.bus_id || b.id || null
          map.set(id || JSON.stringify(b), { ...map.get(id || JSON.stringify(b)), ...b, approved: true, status: 'approved' })
        })
        const merged = Array.from(map.values())
        if (mounted) return setBuses(merged)
      } catch (e) {
        // fallback to local sample data
      }
      const existing = JSON.parse(localStorage.getItem('buses') || 'null')
      if (!existing) {
        const sample = [
          { id: 'b1', plate: 'WP KA-1234', route: 'Peradeniya - Gampola', ownerId: 'OWN-001', status: 'approved' },
          { id: 'b2', plate: 'WP PB-5678', route: 'Peradeniya - Kurunegala', ownerId: 'OWN-002', status: 'approved' },
          { id: 'b3', plate: 'WP LC-9012', route: 'Peradeniya - Matale', ownerId: 'OWN-003', status: 'approved' },
          { id: 'b4', plate: 'WP XX-3344', route: 'Peradeniya - Gampola', ownerId: 'OWN-004', status: 'approved' },
          { id: 'b5', plate: 'WP ZZ-7788', route: 'Peradeniya - Kandy', ownerId: 'OWN-005', status: 'approved' },
          { id: 'b6', plate: 'WP YT-1122', route: 'Peradeniya - Gampola', ownerId: 'OWN-006', status: 'approved' },
        ]
        localStorage.setItem('buses', JSON.stringify(sample))
      }
      if (mounted) setBuses(JSON.parse(localStorage.getItem('buses') || '[]'))
    }
    load()
    return () => { mounted = false }
  }, [])

  const top = getTopRoutes(buses)
  const max = top.length ? Math.max(...top.map(t => t.count)) : 1

  const approvedCount = buses.filter(b => b.status === 'approved' || b.approved === true).length
  const serverRejected = buses.filter(b => b.status === 'rejected' || b.approved === false).length
  let localRejected = 0
  try {
    localRejected = JSON.parse(localStorage.getItem('rejected_buses') || '[]').length || 0
  } catch (e) { localRejected = 0 }
  const rejectedCount = serverRejected + localRejected

  return (
    <div>
      <h2>Analytics</h2>
      <p>All registered (approved) busses and top 5 routes by number of busses.</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: 0 }}>Registered Buses</h3>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 8 }}>{approvedCount}</div>
          <div style={{ color: '#6b7280', marginTop: 6 }}>{buses.length} total, {approvedCount} approved</div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: 0 }}>Rejected Buses</h3>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 8, color: '#ef4444' }}>{rejectedCount}</div>
          <div style={{ color: '#6b7280', marginTop: 6 }}>{rejectedCount} rejected</div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <h3>Top 5 Routes</h3>
        <div style={{ paddingTop: 8 }}>
          {top.length === 0 && <div>No route data available.</div>}
          {top.length > 0 && (() => {
            const viewW = 700
            const viewH = 380
            const margin = { top: 20, right: 20, bottom: 110, left: 48 }
            const w = viewW - margin.left - margin.right
            const h = viewH - margin.top - margin.bottom
            const bars = top
            const count = bars.length
            const gap = 18 // spacing between bars
            // compute bar width but cap to avoid overly wide bars when few items
            const barW = Math.min(48, Math.max(14, Math.floor((w - gap * (count - 1)) / count)))
            // no Y tick labels — only per-bar counts are shown

            return (
              <div style={{ width: '100%', height: 320, padding: '8px 4px' }}>
                <svg viewBox={`0 0 ${viewW} ${viewH}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                  <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* (grid and axis removed) */}

                    {/* Bars */}
                    {bars.map((b, i) => {
                      const x = i * (barW + gap)
                      const barHeight = max > 0 ? (b.count / max) * h : 0
                      const y = h - barHeight
                      return (
                        <g key={b.route}>
                          <rect x={x} y={y} width={barW} height={barHeight} fill="#f59e0b" rx={6} />
                          <text x={x + barW / 2} y={y - 8} fontSize={12} fill="#0f172a" textAnchor="middle">{b.count}</text>
                          <text transform={`translate(${x + barW / 2}, ${h + 36}) rotate(-40)`} fontSize={11} fill="#374151" textAnchor="end" style={{ pointerEvents: 'none' }}>
                            {b.route}
                          </text>
                        </g>
                      )
                    })}

                    {/* axis removed */}
                  </g>
                </svg>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
