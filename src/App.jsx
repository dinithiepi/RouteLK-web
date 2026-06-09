import { useEffect, useState } from 'react'
import Home from './pages/Home'
import RegisteredBuses from './pages/RegisteredBuses'
import About from './pages/About'
import Login from './pages/Login'
import AdminRegister from './pages/admin/AdminRegister'
import AdminDashboard from './pages/admin/AdminDashboard'
import './App.css'

function App() {
  const [route, setRoute] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.startsWith('#/about')) return <About />
  if (route.startsWith('#/registered')) return <RegisteredBuses />
  if (route.startsWith('#/login')) return <Login />
  if (route.startsWith('#/admin/register')) return <AdminRegister />
  if (route.startsWith('#/admin')) return <AdminDashboard />
  return <Home />
}

export default App
