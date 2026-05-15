import { useState, useEffect } from 'react'
import { api } from '../api'

const emptyForm = { name: '', foundedAt: '', location: '', category: '', fundingAmount: '' }

export default function Startups() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ name: '', category: '' })

  const load = async () => {
    setLoading(true)
    try {
      const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([_, v]) => v !== '')
      )
      const res = await api.getStartups(cleanFilter)
      setList(res.data)
      setError('')
    } catch {
      setError('Error al cargar startups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!form.name) return setError('El nombre es requerido')
    setLoading(true)
    try {
      if (editId) {
        await api.updateStartup(editId, form)
      } else {
        await api.createStartup(form)
      }
      setForm(emptyForm)
      setEditId(null)
      setError('')
      load()
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (s) => {
    setEditId(s.id)
    setForm({
      name: s.name || '',
      foundedAt: s.founded_at?.split('T')[0] || '',
      location: s.location || '',
      category: s.category || '',
      fundingAmount: s.funding_amount || ''
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar?')) return
    try {
      await api.deleteStartup(id)
      load()
    } catch {
      setError('Error al eliminar')
    }
  }

  const inputStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }
  const btnStyle = { padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none' }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Startups</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input style={inputStyle} placeholder="Buscar por nombre" value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} />
        <input style={inputStyle} placeholder="Filtrar categoria" value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} />
        <button style={{ ...btnStyle, background: '#4CAF50', color: 'white' }} onClick={load}>Buscar</button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>{editId ? 'Editar Startup' : 'Nueva Startup'}</h3>
        {['name', 'location', 'category'].map(field => (
          <div key={field} style={{ marginBottom: '8px' }}>
            <input style={inputStyle} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
          </div>
        ))}
        <div style={{ marginBottom: '8px' }}>
          <input style={inputStyle} type="date" value={form.foundedAt}
            onChange={e => setForm(f => ({ ...f, foundedAt: e.target.value }))} />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <input style={inputStyle} type="number" placeholder="Funding Amount"
            value={form.fundingAmount}
            onChange={e => setForm(f => ({ ...f, fundingAmount: e.target.value }))} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ ...btnStyle, background: '#2196F3', color: 'white' }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}
          </button>
          {editId && (
            <button style={{ ...btnStyle, background: '#ccc' }}
              onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancelar</button>
          )}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: 'white' }}>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Categoria</th>
              <th style={{ padding: '10px' }}>Ubicacion</th>
              <th style={{ padding: '10px' }}>Funding</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{s.name}</td>
                <td style={{ padding: '10px' }}>{s.category}</td>
                <td style={{ padding: '10px' }}>{s.location}</td>
                <td style={{ padding: '10px' }}>${s.funding_amount}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                  <button style={{ ...btnStyle, background: '#FF9800', color: 'white' }}
                    onClick={() => handleEdit(s)}>Editar</button>
                  <button style={{ ...btnStyle, background: '#f44336', color: 'white' }}
                    onClick={() => handleDelete(s.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}