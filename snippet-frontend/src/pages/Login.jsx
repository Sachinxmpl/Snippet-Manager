import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { getMe } from '../api/auth'

export default function Login() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      const res = await getMe()
      setUser(res.data)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>
          &lt;snippets /&gt;
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 13 }}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} required />
          </div>
          {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: 10, marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 20, textAlign: 'center' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}