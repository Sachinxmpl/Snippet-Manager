import { useNavigate } from 'react-router-dom'
import TagBadge from './TagBadge'

const LANG_COLORS = {
  python: '#3b82f6',
  javascript: '#f59e0b',
  typescript: '#60a5fa',
  rust: '#f97316',
  go: '#06b6d4',
  css: '#a78bfa',
  html: '#f87171',
  bash: '#4ade80',
}

export default function SnippetCard({ snippet, onDelete }) {
  const navigate = useNavigate()
  const langColor = LANG_COLORS[snippet.language?.toLowerCase()] || 'var(--text-muted)'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onClick={() => navigate(`/edit/${snippet.id}`)}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{snippet.title}</span>
          {snippet.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              {snippet.description.length > 80
                ? snippet.description.slice(0, 80) + '…'
                : snippet.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            color: langColor,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font)',
            background: `${langColor}18`,
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {snippet.language}
          </span>
          {snippet.is_public && (
            <span style={{ fontSize: 11, color: 'var(--success)', background: '#22c55e18', padding: '2px 6px', borderRadius: 4 }}>
              public
            </span>
          )}
        </div>
      </div>

      {/* Code preview */}
      <pre style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font)',
        fontSize: 12,
        overflow: 'hidden',
        padding: '8px 12px',
        whiteSpace: 'pre',
        maxHeight: 72,
      }}>
        {snippet.code.slice(0, 200)}
      </pre>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {snippet.tags?.map((t) => <TagBadge key={t.id} name={t.name} />)}
        </div>
        <button
          className="btn-danger"
          style={{ fontSize: 12, padding: '3px 10px' }}
          onClick={(e) => { e.stopPropagation(); onDelete(snippet.id) }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}