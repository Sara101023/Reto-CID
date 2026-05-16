import { useState, useEffect } from 'react'
import { api } from '../api'
import { showToast } from '../App'

const emptyForm = { name: '', sector: '', description: '', adoptionLevel: '' }
const levels = ['low', 'medium', 'high']

const levelColors = {
  low: { bg: '#fff3e0', color: '#e65100' },
  medium: { bg: '#e3f2fd', color: '#1565c0' },
  high: { bg: '#e8f5e9', color: '#2e7d32' }
}

const card = {
  background: 'white', borderRadius: '16px',
  padding: '1.5rem', boxShadow: '0 2px 16px rgba(13,71,161,0.08)',
  marginBottom: '1.5rem'
}

const inputStyle = {
  padding: '10px 14px', borderRadius: '10px',
  border: '2px solid #e3eaf7', width: '100%',
  fontSize: '0.95rem', fontFamily: 'inherit',
  outline: 'none', transition: 'border 0.2s', background: '#f8faff'
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
  fontSize: '0.85rem', background: '#ff9800', color: 'white'
}

const btnDanger = {
  padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
  border: 'none', fontFamily: 'inherit', fontWeight: '600',
  fontSize: '0.85rem', background: '#f44336', color: 'white'
}

export default function Technologies() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ sector: '', adoptionLevel: '' })

  const load = async () => {
    setLoading(true)
    setList([])
    try {
      const cleanFilter = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v !== ''))
      const res = await api.getTechnologies(cleanFilter)
      setList(res.data)
    } catch {
      showToast('Error al cargar tecnologias', 'error')
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
        await api.updateTechnology(editId, form)
        showToast('Tecnología actualizada exitosamente', 'success')
      } else {
        await api.createTechnology(form)
        showToast('Tecnología creada exitosamente', 'success')
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

  const handleEdit = (t) => {
    setEditId(t.id)
    setForm({ name: t.name || '', sector: t.sector || '', description: t.description || '', adoptionLevel: t.adoption_level || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta tecnología?')) return
    try {
      await api.deleteTechnology(id)
      showToast('Tecnología eliminada', 'info')
      load()
    } catch {
      showToast('Error al eliminar', 'error')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0d47a1', letterSpacing: '-0.03em' }}>
          💻 Technologies
        </h1>
        <p style={{ color: '#7890b2', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Gestiona el catálogo de tecnologías
        </p>
      </div>

      <div style={{ ...card }}>
        <p style={{ fontWeight: '700', color: '#1565c0', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🔍 Filtros
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input style={{ ...inputStyle, flex: 1, minWidth: '160px' }} placeholder="Sector"
            value={filter.sector} onChange={e => setFilter(f => ({ ...f, sector: e.target.value }))} />
          <select style={{ ...inputStyle, flex: 1, minWidth: '160px' }} value={filter.adoptionLevel}
            onChange={e => setFilter(f => ({ ...f, adoptionLevel: e.target.value }))}>
            <option value="">Todos los niveles</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button style={{ ...btnPrimary, background: 'linear-gradient(135deg, #00b09b, #1565c0)' }} onClick={load}>
            Buscar
          </button>
          
        </div>
      </div>

      <div style={{ ...card, border: editId ? '2px solid #1565c0' : '2px solid transparent' }}>
        <p style={{ fontWeight: '700', color: '#1565c0', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {editId ? '✏️ Editar Tecnología' : '➕ Nueva Tecnología'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <input style={inputStyle} placeholder="Nombre *" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input style={inputStyle} placeholder="Sector" value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} />
          <input style={{ ...inputStyle, gridColumn: '1 / -1' }} placeholder="Descripción" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <select style={{ ...inputStyle, gridColumn: '1 / -1' }} value={form.adoptionLevel}
            onChange={e => setForm(f => ({ ...f, adoptionLevel: e.target.value }))}>
            <option value="">Adoption Level</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button style={btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear Tecnología'}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💻</div>
            No hay tecnologías registradas
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faff' }}>
                {['Nombre', 'Sector', 'Descripción', 'Adopción', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '700', color: '#7890b2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((t, i) => (
                <tr key={t.id} style={{ borderTop: '1px solid #f0f4ff', background: i % 2 === 0 ? 'white' : '#fafcff' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1a237e' }}>{t.name}</td>
                  <td style={{ padding: '12px 16px', color: '#5a6a85' }}>{t.sector || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#5a6a85', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {t.adoption_level ? (
                      <span style={{
                        background: levelColors[t.adoption_level]?.bg || '#f5f5f5',
                        color: levelColors[t.adoption_level]?.color || '#333',
                        borderRadius: '999px', padding: '3px 10px',
                        fontSize: '0.82rem', fontWeight: '600'
                      }}>
                        {t.adoption_level}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                    <button style={btnWarning} onClick={() => handleEdit(t)}>Editar</button>
                    <button style={btnDanger} onClick={() => handleDelete(t.id)}>Eliminar</button>
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