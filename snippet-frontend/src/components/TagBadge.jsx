export default function TagBadge({ name, onRemove }) {
  return (
    <span style={{
      background: 'var(--surface-hover)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      color: 'var(--text-muted)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      padding: '2px 8px',
    }}>
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
          }}
        >×</button>
      )}
    </span>
  )
}