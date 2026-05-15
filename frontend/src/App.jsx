import { Routes, Route, Link } from 'react-router-dom'
import Startups from './pages/Startups'
import Technologies from './pages/Technologies'

export default function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#1a1a2e', display: 'flex', gap: '2rem' }}>
        <Link to="/startups" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Startups</Link>
        <Link to="/technologies" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Technologies</Link>
      </nav>
      <Routes>
        <Route path="/startups" element={<Startups />} />
        <Route path="/technologies" element={<Technologies />} />
        <Route path="/" element={<Startups />} />
      </Routes>
    </div>
  )
}