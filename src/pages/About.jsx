import React from 'react'
import './Home.css'
import applogo from '../../images/applogo.jpeg'
import aboutImg from '../../images/about.png'
import uop from '../../images/uop.jpg'

const advantages = [
  'Accurate ETA calculations for each stop',
  'Book AC bus seats quickly and securely',
  'Real-time emergency alerts and contacts',
  'Live-tracked buses with precise locations',
  'Real time crowd level of the bus',
]

export default function About() {
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
        <a className="hd-tab" href="#/registered">Registered Busses</a>
        <a className="hd-tab" href="#/login">Admin Dashboard</a>
      </nav>

      <main className="hd-container">
        <section className="hd-about-hero">
          <div className="hd-about-hero-inner">
            <img src={aboutImg} alt="About" className="hd-about-hero-img" />
            <div className="hd-about-hero-text" style={{ alignSelf: 'start' }}>
              <h1 style={{ marginBottom: 60 }}>RouteLK</h1>
              <p>
                This project was developed to improve public transport systems in
                Sri Lanka and provide safer, more reliable travel. And to provide safe, reliable, and accessible transportation for people
                across Sri Lanka by leveraging simple and effective digital tools.
              </p>
            </div>
          </div>
        </section>

        <section className="about-advantages">
          <h2>What we provide</h2>
          <div className="about-advantages-grid">
            {advantages.map((a) => (
              <div className="about-adv-card" key={a}>
                <div className="about-adv-title">{a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hd-about" style={{ marginTop: 28 }}>
          <h2>Our Team</h2>
          <div className="hd-about-grid">
            <img className="hd-about-img" src={uop} alt="Team" />
            <div className="hd-about-text">
              <p>
                We are undergraduate engineering students from the University of
                Peradeniya. This project is developed as part of our initiative to
                improve public transport systems in Sri Lanka.
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
