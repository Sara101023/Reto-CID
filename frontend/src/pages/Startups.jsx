import { useState, useEffect } from 'react'
import { api } from '../api'
import { showToast } from '../App'

const emptyForm = { name: '', foundedAt: '', location: '', category: '', fundingAmount: '' }

const card = {
  background: 'white',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 2px 16px rgba(13,71,161,0.08)',
  marginBottom: '1.5rem'
}

const inputStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '2px solid #e3eaf7',
  width: '100%',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border 0.2s',
  background: '#f8faff'
}

const btnPrimary = {
  padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
  border: 'none', fontFamily: 'inherit', fontWeight: '700',
  fontSize: '0.9rem', transition: 'all 0.2s',
  background: 'linear-gradient(135deg, #1565c0, #1a237e)',
  color: 'white', boxShadow: '0 4px 12px rgba(21,101,192,0.3)'
}

const btnWarning = {
  padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
  border: 'none', fontFamily: 'inherit', fontWeight: '600',
  fontSize: '0.85rem', background: '#ff9800', color: 'white', transition: 'all 0.2s'
}

const btnDanger = {
  padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
  border: 'none', fontFamily: 'inherit', fontWeight: '600',
  fontSize: '0.85rem', background: '#f44336', color: 'white', transition: 'all 0.2s'
}

export default function Startups() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ name: '', category: '' })

  const load = async () => {
    setLoading(true)
    setList([])
    try {
      const cleanFilter = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v !== ''))
      const res = await api.getStartups(cleanFilter)
      setList(res.data)
    } catch {
      showToast('Error al cargar startups', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!form.name) return showToast('El nombre es requerido', 'error')
    setLoading(true)
    try {
      if (editId) {
        await api.updateStartup(editId, form)
        showToast('Startup actualizada exitosamente', 'success')
      } else {
        await api.createStartup(form)
        showToast('Startup creada exitosamente', 'success')
      }
      setForm(emptyForm)
      setEditId(null)
      load()
    } catch (e) {
      showToast(e.response?.data?.message || 'Error al guardar', 'error')
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta startup?')) return
    try {
      await api.deleteStartup(id)
      showToast('Startup eliminada', 'info')
      load()
    } catch {
      showToast('Error al eliminar', 'error')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0d47a1', letterSpacing: '-0.03em' }}>
          🚀 Startups
        </h1>
        <p style={{ color: '#7890b2', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Gestiona el directorio de startups
        </p>
      </div>

      <div style={{ ...card }}>
        <p style={{ fontWeight: '700', color: '#1565c0', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🔍 Filtros
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input style={{ ...inputStyle, flex: 1, minWidth: '160px' }} placeholder="Buscar por nombre"
            value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} />
          <input style={{ ...inputStyle, flex: 1, minWidth: '160px' }} placeholder="Filtrar categoria"
            value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} />
          <button style={{ ...btnPrimary, background: 'linear-gradient(135deg, #00b09b, #1565c0)' }} onClick={load}>
            Buscar
          </button>
          <button style={{ ...btnPrimary, background: '#e0e7ef', color: '#5a6a85', boxShadow: 'none' }}
            onClick={() => { setFilter({ name: '', category: '' }); setTimeout(load, 50) }}>
            Limpiar
          </button>
        </div>
      </div>

      <div style={{ ...card, border: editId ? '2px solid #1565c0' : '2px solid transparent' }}>
        <p style={{ fontWeight: '700', color: '#1565c0', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {editId ? '✏️ Editar Startup' : '➕ Nueva Startup'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[['name', 'Nombre *'], ['location', 'Ubicación'], ['category', 'Categoría']].map(([field, label]) => (
            <input key={field} style={inputStyle} placeholder={label}
              value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
          ))}
          <input style={inputStyle} type="date" value={form.foundedAt}
            onChange={e => setForm(f => ({ ...f, foundedAt: e.target.value }))} />
          <input style={{ ...inputStyle, gridColumn: '1 / -1' }} type="number" placeholder="Funding Amount (USD)"
            value={form.fundingAmount} onChange={e => setForm(f => ({ ...f, fundingAmount: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button style={btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear Startup'}
          </button>
          {editId && (
            <button style={{ ...btnPrimary, background: '#e0e7ef', color: '#5a6a85', boxShadow: 'none' }}
              onClick={() => { setEditId(null); setForm(emptyForm) }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f4ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontWeight: '700', color: '#1565c0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📋 Registros
          </p>
          <span style={{ background: '#e3eaf7', color: '#1565c0', borderRadius: '999px', padding: '2px 12px', fontSize: '0.85rem', fontWeight: '700' }}>
            {list.length}
          </span>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#7890b2' }}>Cargando...</div>
        ) : list.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#7890b2' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
            No hay startups registradas
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faff' }}>
                {['Nombre', 'Categoría', 'Ubicación', 'Funding', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: '#7890b2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((s, i) => (
                <tr key={s.id} style={{ borderTop: '1px solid #f0f4ff', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1a237e' }}>{s.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#e3eaf7', color: '#1565c0', borderRadius: '999px', padding: '3px 10px', fontSize: '0.82rem', fontWeight: '600' }}>
                      {s.category || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#5a6a85' }}>{s.location || '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#00897b' }}>
                    {s.funding_amount ? `$${Number(s.funding_amount).toLocaleString()}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                    <button style={btnWarning} onClick={() => handleEdit(s)}>Editar</button>
                    <button style={btnDanger} onClick={() => handleDelete(s.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}