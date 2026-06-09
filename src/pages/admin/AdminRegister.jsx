import React, { useState } from 'react'
import '../Home.css'
import applogo from '../../../images/applogo.jpeg'
import { adminRegister, adminVerifyOTP } from '../../api'

export default function AdminRegister() {
  const [fullName, setFullName] = useState('')
  const [governmentEmail, setGovernmentEmail] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [designation, setDesignation] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!fullName || !governmentEmail || !idNumber || !employeeNumber || !designation) {
      setError('Please fill all required fields')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError('Password must have uppercase, number and symbol e.g. Test1234!')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await adminRegister({ fullName, governmentEmail, idNumber, employeeNumber, designation, contactNumber, password })
      setShowOTP(true)
      setSuccess('OTP sent to ' + governmentEmail + '. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }
    try {
      setLoading(true)
      await adminVerifyOTP(governmentEmail, otp)
      setSuccess('Account verified! Redirecting to login...')
      setTimeout(() => { window.location.hash = '#/login' }, 1500)
    } catch (err) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  // OTP Screen
  if (showOTP) {
    return (
      <div className="home-dashboard">
        <header className="hd-topbar">
          <div>
            <div className="hd-title">RouteLK</div>
            <div className="hd-sub">Verify Your Email</div>
          </div>
          <img src={applogo} alt="RouteLK logo" className="hd-logo" />
        </header>
        <main className="hd-container" style={{ minHeight: 'calc(100vh - 112px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <section style={{ background: '#fff', padding: 32, borderRadius: 8, width: '100%', maxWidth: 400, boxSizing: 'border-box', textAlign: 'center' }}>
            <h2>Enter OTP</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>
              We sent a 6-digit code to<br />
              <strong>{governmentEmail}</strong>
            </p>
            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                style={{ width: '100%', padding: 12, fontSize: 24, textAlign: 'center', letterSpacing: 8, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
              {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
              {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
              <button
                className="btn primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: 16, padding: 10 }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => { setShowOTP(false); setError(''); setSuccess(''); }}
                style={{ marginTop: 10, background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to registration
              </button>
            </form>
          </section>
        </main>
      </div>
    )
  }

  // Registration Screen
  return (
    <div className="home-dashboard">
      <header className="hd-topbar">
        <div>
          <div className="hd-title">RouteLK</div>
          <div className="hd-sub">Admin Registration</div>
        </div>
        <img src={applogo} alt="RouteLK logo" className="hd-logo" />
      </header>
      <main className="hd-container" style={{ minHeight: 'calc(100vh - 112px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section style={{ background: '#fff', padding: 24, borderRadius: 8, width: '100%', maxWidth: 720, boxSizing: 'border-box' }}>
          <h2>Create Admin Account</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              <div>
                <label>Full name</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
              <div>
                <label>Government email</label>
                <input required type="email" value={governmentEmail} onChange={(e) => setGovernmentEmail(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
              <div>
                <label>ID number</label>
                <input required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
              <div>
                <label>Government employee number</label>
                <input required value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
              <div>
                <label>Designation</label>
                <input required value={designation} onChange={(e) => setDesignation(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
              <div>
                <label>Contact number</label>
                <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="e.g. +94123456789" style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
              <div>
                <label>Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
                <small style={{ color: '#888' }}>Min 8 chars, must include uppercase, number and symbol</small>
              </div>
              <div>
                <label>Confirm password</label>
                <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
              </div>
            </div>
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
            <div style={{ marginTop: 16 }}>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Create account'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}