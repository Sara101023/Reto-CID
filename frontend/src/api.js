 import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL

export const api = {
  // Startups
  getStartups: (params) => axios.get(`${BASE}/startups/read`, { params }),
  getStartup: (id) => axios.get(`${BASE}/startups/read/${id}`),
  createStartup: (data) => axios.post(`${BASE}/startups/create`, data),
  updateStartup: (id, data) => axios.put(`${BASE}/startups/update/${id}`, data),
  deleteStartup: (id) => axios.delete(`${BASE}/startups/delete/${id}`),

  // Technologies
  getTechnologies: (params) => axios.get(`${BASE}/technologies/read`, { params }),
  getTechnology: (id) => axios.get(`${BASE}/technologies/read/${id}`),
  createTechnology: (data) => axios.post(`${BASE}/technologies/create`, data),
  updateTechnology: (id, data) => axios.put(`${BASE}/technologies/update/${id}`, data),
  deleteTechnology: (id) => axios.delete(`${BASE}/technologies/delete/${id}`),
}
