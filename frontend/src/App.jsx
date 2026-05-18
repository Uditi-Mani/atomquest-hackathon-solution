import { Link, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <nav className="px-6 py-4 flex justify-between items-center border-b border-white/10">
        <h1 className="font-bold text-xl">AtomQuest Portal</h1>
        <div className="space-x-4 text-sm">
          <Link to="/" className="hover:text-cyan-300">Home</Link>
          <Link to="/login" className="hover:text-cyan-300">Login</Link>
          <Link to="/dashboard" className="hover:text-cyan-300">Dashboard</Link>
          <Link to="/admin" className="hover:text-cyan-300">Admin</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}
