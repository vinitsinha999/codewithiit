/**
 * src/api/client.js
 * Central axios instance for all API calls.
 * 
 * WHY: Instead of writing the base URL in every fetch call,
 *      we configure it once here. All API calls import this.
 * 
 * The interceptor automatically attaches the JWT token to
 * every request — so protected routes work without manual headers.
 */

import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR
// Runs before every API call — attaches JWT token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR
// If token expired (401) → clear storage → redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient


// ── API FUNCTIONS ─────────────────────────────────────────────────
// Clean functions for each endpoint — components call these, not axios directly

export const authAPI = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  me: () => apiClient.get('/api/auth/me'),
}

export const lessonsAPI = {
  getAll: () => apiClient.get('/api/lessons'),
  getOne: (slug) => apiClient.get(`/api/lessons/${slug}`),
  verifyAnswer: (slug, choiceId) =>
    apiClient.post(`/api/lessons/${slug}/verify`, { choice_id: choiceId }),
}

export const progressAPI = {
  save: (data) => apiClient.post('/api/progress', data),
  getMine: () => apiClient.get('/api/progress/me'),
}

export const aiAPI = {
  getHint: (data) => apiClient.post('/api/ai/hint', data),
}
