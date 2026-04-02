import api from './axios'

export const register = (data) => api.post('/auth/register/', data)

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login/', { email, password })
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

export const getMe = () => api.get('/auth/me/')