 import React, { useState, useEffect } from 'react'
import { api } from '../api'

const emptyForm = { name: '', sector: '', description: '', adoptionLevel: '' }
const levels = ['', 'low', 'medium', 'high']

export default function Technologies() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ sector: '', adoptionLevel: '' })

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.getTechnologies(filter)
      setList(res.data)
      setError('')
    } catch {
      setError('Error al cargar tecnologías')
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
        await api.updateTechnology(editId, form)
      } else {
        await api.createTechnology(form)
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

  const handleEdit = (t) => {
    setEditId(t.id)
    setForm({ name: t.name || '', sector: t.sector || '', description: t.description || '', adoptionLevel: t.adoption_level || '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar?')) return
    try {
      await api.deleteTechnology(id)
      load()
    } catch {
      setError('Error al eliminar')
    }
  }

  const inputStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }
  const btnStyle = { padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none' }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>💻 Technologies</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input style={inputStyle} placeholder="Sector" value={filter.sector}
          onChange={e => setFilter(f => ({ ...f, sector: e.target.value }))} />
        <select style={inputStyle} value={filter.adoptionLevel}
          onChange={e => setFilter(f => ({ ...f, adoptionLevel: e.target.value }))}>
          <option value="">Todos los niveles</option>
          {levels.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <button style={{ ...btnStyle, background: '#4CAF50', color: 'white' }} onClick={load}>Buscar</button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>{editId ? 'Editar Tecnología' : 'Nueva Tecnología'}</h3>
        {['name', 'sector', 'description'].map(field => (
          <div key={field} style={{ marginBottom: '8px' }}>
            <input style={inputStyle} placeholder={field}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
          </div>
        ))}
        <div style={{ marginBottom: '8px' }}>
          <select style={inputStyle} value={form.adoptionLevel}
            onChange={e => setForm(f => ({ ...f, adoptionLevel: e.target.value }))}>
            <option value="">Adoption Level</option>
            {levels.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
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
              <th style={{ padding: '10px' }}>Sector</th>
              <th style={{ padding: '10px' }}>Adopción</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{t.name}</td>
                <td style={{ padding: '10px' }}>{t.sector}</td>
                <td style={{ padding: '10px' }}>{t.adoption_level}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                  <button style={{ ...btnStyle, background: '#FF9800', color: 'white' }}
                    onClick={() => handleEdit(t)}>Editar</button>
                  <button style={{ ...btnStyle, background: '#f44336', color: 'white' }}
                    onClick={() => handleDelete(t.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
