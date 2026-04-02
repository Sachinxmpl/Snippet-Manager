import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateSnippet from './pages/CreateSnippet'
import EditSnippet from './pages/EditSnippet'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-center" style={{ color: 'var(--text-muted)' }}>Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/new"      element={<PrivateRoute><CreateSnippet /></PrivateRoute>} />
      <Route path="/edit/:id" element={<PrivateRoute><EditSnippet /></PrivateRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  )
}