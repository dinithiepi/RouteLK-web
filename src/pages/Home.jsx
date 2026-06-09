import React, { useEffect, useState } from 'react'
import './Home.css'

// Local images moved to project-level `images/` folder
import bus1 from '../../images/bus1.jpg'
import bus2 from '../../images/bus2.jpg'
import bus4 from '../../images/bus4.jpeg'
import uop from '../../images/uop.jpg'
import app1 from '../../images/app1.jpeg'
import app2 from '../../images/app2.jpeg'
import applogo from '../../images/applogo.jpeg'

const images = [bus1, bus2, bus4]

export default function Home() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500)
    return () => clearInterval(t)
  }, [])

  const features = [
    { title: 'Bus Tracking', desc: 'Real-time location of buses on a map.' },
    { title: 'Estimate Arrival Time', desc: 'Accurate ETAs for each stop.' },
    { title: 'Easy Bus Booking', desc: 'Quick tickets and seat reservations.' },
    { title: 'Know Emergencies and crowd levels', desc: 'Alerts and quick-response contacts.' },
  ]

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
        <a className="hd-tab" href="#/registered">Registered Busses</a>
        <a className="hd-tab" href="#/login">Admin Dashboard</a>
        <a className="hd-tab" href="#/about">About Us</a>
      </nav>

      <main className="hd-container">
        <section className="hd-hero">
          <img src={images[idx]} alt="hero" className="hd-hero-img" />
          <div className="hd-hero-overlay">
            <h1>Efficient routes. Safer journeys.</h1>
            <p>Manage buses and passengers from a single dashboard.</p>
          </div>
        </section>

        <section className="hd-features">
          {features.map((f) => (
            <div className="hd-feature-card" key={f.title}>
              <div className="hd-feature-title">{f.title}</div>
              <div className="hd-feature-desc">{f.desc}</div>
            </div>
          ))}
        </section>

        <section className="hd-promo-card">
          <div className="hd-promo-inner">
            <div className="promo-devices">
              <div className="promo-device">
                <img src={app1} alt="App preview 1" className="promo-device-img" />
              </div>
              <div className="promo-device">
                <img src={app2} alt="App preview 2" className="promo-device-img" />
              </div>
            </div>
            <div className="promo-content">
              <h2>Get our app and make your life easy</h2>
              <p>Download RouteLK and simplify your daily commute.</p>
              <ul className="promo-features">
                <li>Accurate ETA calculations for every stop</li>
                <li>Book AC bus seats quickly and securely</li>
                <li>Real-time emergency alerts for your bus</li>
                <li>Live-tracked buses — pick the right bus and arrive on time</li>
              </ul>
              <div className="promo-cta">
                <a className="btn primary" href="#">Get the App</a>
                <a className="btn outline" href="#">Learn More</a>
              </div>
            </div>
          </div>
        </section>

        <section className="hd-about">
          <h2>About Us</h2>
          <div className="hd-about-grid">
            <img
              className="hd-about-img"
              src={uop}
              alt="Team"
            />
            <div className="hd-about-text">
              <h3>Our Team</h3>
              <p>
                We are undergraduate engineering students from the University of
                Peradeniya. This project is developed as part of our initiative to
                improve public transport systems in Sri Lanka.
              </p>
              <h4>Our Vision</h4>
              <p>
                To provide safe, reliable, and accessible transportation for people
                across Sri Lanka by leveraging simple and effective digital tools.
              </p>
            </div>
          </div>
        </section>
        <section className="hd-contact" aria-label="Contact">
          <div className="hd-contact-inner">
            <h3>Contact Us</h3>
            <p>
              Email: <a href="mailto:info@routelk.lk">info@routelk.lk</a> | <a href="mailto:support@routelk.lk">support@routelk.lk</a>
            </p>
            <p>Phone: +94 77 123 4567</p>
            <p>Address: University of Peradeniya, Peradeniya, Sri Lanka</p>
          </div>
        </section>
      </main>
    </div>
  )
}
