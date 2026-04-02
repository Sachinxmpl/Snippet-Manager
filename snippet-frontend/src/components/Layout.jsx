import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Link to="/" style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16, textDecoration: 'none', letterSpacing: '-0.02em' }}>
          &lt;snippets /&gt;
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</span>
          <Link to="/new">
            <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 13 }}>+ New</button>
          </Link>
          <button className="btn-ghost" onClick={handleLogout} style={{ padding: '6px 14px', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  )
}