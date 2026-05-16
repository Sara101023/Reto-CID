import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Startups from './pages/Startups'
import Technologies from './pages/Technologies'
import { useState, useEffect } from 'react'

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

function WelcomeModal({ onClose }) {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        backdropFilter: 'blur(6px)',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9998,
        animation: 'fadeIn 0.3s ease'
      }} />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        background: 'white',
        borderRadius: '20px',
        padding: '2.5rem',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 24px 64px rgba(13,71,161,0.25)',
        animation: 'slideIn 0.3s ease'
      }}>
        <div style={{
          width: '56px', height: '56px',
          background: 'linear-gradient(135deg, #1565c0, #1a237e)',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', marginBottom: '1.25rem'
        }}>
          💡
        </div>
        <h2 style={{
          color: '#0d47a1', fontWeight: '800',
          fontSize: '1.4rem', marginBottom: '0.75rem',
          letterSpacing: '-0.02em'
        }}>
          Bienvenido a Reto CID
        </h2>
        <p style={{ color: '#5a6a85', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Este sistema corre sobre servicios gratuitos en Render.
        </p>
        <div style={{
          background: '#f0f4ff',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #1565c0'
        }}>
          <p style={{ color: '#1565c0', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            Aviso importante
          </p>
          <p style={{ color: '#5a6a85', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            En el primer acceso, los servicios pueden tardar entre <strong>30 y 60 segundos</strong> en despertar.
            Si la tabla aparece vacía, espera unos segundos y da clic en <strong>"Buscar"</strong>.
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #1565c0, #1a237e)',
            color: 'white',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(21,101,192,0.3)',
            transition: 'opacity 0.2s'
          }}
        >
          Entendido
        </button>
      </div>
    </>
  )
}

export default function App() {
  const location = useLocation()
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [showWelcome, setShowWelcome] = useState(true)

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

      {/* Modal de bienvenida */}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      {/* Navbar */}
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
            Startups
          </Link>
          <Link to="/technologies" className={`nav-link ${location.pathname === '/technologies' ? 'active' : ''}`}>
            Technologies
          </Link>
        </div>
      </nav>

      {/* Toast */}
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