import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ['Registration failed.'] })
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (f) => errors[f]?.[0] && <p className="error-msg">{errors[f][0]}</p>

  return (
    <div className="page-center">
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>
          &lt;snippets /&gt;
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 13 }}>Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} onChange={set('username')} required autoFocus />
            {fieldError('username')}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} required />
            {fieldError('email')}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} required />
            {fieldError('password')}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={form.password2} onChange={set('password2')} required />
            {fieldError('password2')}
          </div>
          {errors.non_field_errors && <p className="error-msg" style={{ marginBottom: 12 }}>{errors.non_field_errors[0]}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: 10, marginTop: 4 }}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 20, textAlign: 'center' }}>
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}