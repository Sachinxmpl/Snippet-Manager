import api from './axios'

// Snippets
export const getSnippets = (params) =>
  api.get('/snippets/', { params }).then((r) => r.data)

export const getSnippet = (id) =>
  api.get(`/snippets/${id}/`).then((r) => r.data)

export const createSnippet = (data) =>
  api.post('/snippets/', data).then((r) => r.data)

export const updateSnippet = (id, data) =>
  api.patch(`/snippets/${id}/`, data).then((r) => r.data)

export const deleteSnippet = (id) =>
  api.delete(`/snippets/${id}/`)

// Tags
export const getTags = () =>
  api.get('/snippets/tags/').then((r) => r.data)

export const createTag = (name) =>
  api.post('/snippets/tags/', { name }).then((r) => r.data)

export const deleteTag = (id) =>
  api.delete(`/snippets/tags/${id}/`)