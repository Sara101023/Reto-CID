import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Startups from './pages/Startups'
import Technologies from './pages/Technologies'
import { useState } from 'react'

export function Toast({ message, type }) {
  if (!message) return null
  const colors = {
    success: 'linear-gradient(135deg, #00b09b, #96c93d)',
    error: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
    info: 'linear-gradient(135deg, #2196f3, #0d47a1)',
  }
  return (
    <div style={{
      position: 'fixed', top: '2rem', right: '2rem', zIndex: 9999,
      background: colors[type] || colors.success,
      color: 'white', padding: '1rem 1.5rem',
      borderRadius: '12px', fontWeight: '600', fontSize: '0.95rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.3s ease',
      maxWidth: '320px', letterSpacing: '0.01em'
    }}>
      {type === 'success' ? '✅ ' : type === 'error' ? '❌ ' : 'ℹ️ '}{message}
    </div>
  )
}

export let showToast = () => {}

export default function App() {
  const location = useLocation()
  const [toast, setToast] = useState({ message: '', type: 'success' })

  showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 2500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-link {
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem 1.2rem;
          border-radius: 999px;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-link:hover { color: white; background: rgba(255,255,255,0.15); }
        .nav-link.active { color: white; background: rgba(255,255,255,0.2); }
        .page { animation: fadeIn 0.4s ease; }
      `}</style>

      {/* Navbar con gradiente azul */}
      <nav style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 24px rgba(13,71,161,0.4)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem'
          }}>💡</div>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Reto CID
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/startups" className={`nav-link ${location.pathname === '/startups' || location.pathname === '/' ? 'active' : ''}`}>
            🚀 Startups
          </Link>
          <Link to="/technologies" className={`nav-link ${location.pathname === '/technologies' ? 'active' : ''}`}>
            💻 Technologies
          </Link>
        </div>
      </nav>

      {/* Toast notification */}
      {toast.message && (
        <>
          <div style={{
            position: 'fixed', inset: 0, backdropFilter: 'blur(4px)',
            background: 'rgba(0,0,0,0.2)', zIndex: 9998,
            animation: 'fadeIn 0.2s ease'
          }} />
          <Toast message={toast.message} type={toast.type} />
        </>
      )}

      <div className="page">
        <Routes>
          <Route path="/startups" element={<Startups />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/" element={<Startups />} />
        </Routes>
      </div>
    </div>
  )
}
