import React, { useEffect, useState } from 'react'
import './Home.css'
import applogo from '../../images/applogo.jpeg'
import { getApprovedBuses } from '../api'

const sampleBuses = [
  { plate: 'WP KA-1234', route: 'Peradeniya - Gampola', ownerId: 'OWN-001' },
  { plate: 'WP PB-5678', route: 'Peradeniya - Kurunegala', ownerId: 'OWN-002' },
  { plate: 'WP LC-9012', route: 'Peradeniya - Matale', ownerId: 'OWN-003' },
]

export default function RegisteredBuses() {
  const [buses, setBuses] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getApprovedBuses()
        if (mounted) setBuses(Array.isArray(data) ? data : (data && data.buses) || [])
        return
      } catch (e) {
        // fallback to sample
      }
      if (mounted) setBuses(sampleBuses)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="home-dashboard">
      <header className="hd-topbar">
        <div>
          <div className="hd-title">RouteLK</div>
          <div className="hd-sub">Track your bus & save your time</div>
        </div>
        <img src={applogo} alt="RouteLK logo" className="hd-logo" />
      </header>

      <nav className="hd-tabs" aria-label="Primary">
        <a className="hd-tab" href="#/">Home</a>
        <a className="hd-tab" href="#/login">Admin Dashboard</a>
        <a className="hd-tab" href="#/about">About Us</a>
      </nav>

      <main className="hd-container">
        <section className="hd-registered-intro">
          <p>Registered buses to RouteLK</p>
        </section>

        <section className="hd-registered-table">
          <table className="registered-table">
            <thead>
              <tr>
                <th>Bus Number Plate</th>
                <th>Bus Route</th>
                <th>Bus Owner ID</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b, i) => (
                <tr key={b.id || b.bus_id || b.plate || i}>
                  <td>{b.plate || b.bus_number}</td>
                  <td>{b.route}</td>
                  <td>{b.ownerId || b.owner_nic}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {buses.length === 0 && <div style={{ padding: 12 }}>No registered buses available.</div>}
        </section>
      </main>
    </div>
  )
}
