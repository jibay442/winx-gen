import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const listCreations = () => api.get('/winx').then(r => r.data)
export const getCreation = (id) => api.get(`/winx/${id}`).then(r => r.data)
export const createCreation = (data) => api.post('/winx', data).then(r => r.data)
export const updateCreation = (id, data) => api.put(`/winx/${id}`, data).then(r => r.data)
export const deleteCreation = (id) => api.delete(`/winx/${id}`)
