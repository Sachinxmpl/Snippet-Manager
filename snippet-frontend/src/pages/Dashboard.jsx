import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSnippets, deleteSnippet } from '../api/snippets'
import Layout from '../components/Layout'
import SnippetCard from '../components/SnippetCard'

export default function Dashboard() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('')

  const params = {}
  if (search) params.search = search
  if (language) params.language = language

  const { data, isLoading, isError } = useQuery({
    queryKey: ['snippets', params],
    queryFn: () => getSnippets(params),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSnippet,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snippets'] }),
  })

  const snippets = data?.results || []

  return (
    <Layout>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets…"
          style={{ maxWidth: 280 }}
        />
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Filter by language…"
          style={{ maxWidth: 180 }}
        />
        {(search || language) && (
          <button className="btn-ghost" onClick={() => { setSearch(''); setLanguage('') }} style={{ whiteSpace: 'nowrap' }}>
            Clear
          </button>
        )}
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13 }}>
          {data?.count ?? '—'} snippet{data?.count !== 1 ? 's' : ''}
        </span>
      </div>

      {/* States */}
      {isLoading && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 60 }}>Loading…</p>
      )}

      {isError && (
        <p style={{ color: 'var(--danger)', textAlign: 'center', marginTop: 60 }}>Failed to load snippets.</p>
      )}

      {!isLoading && !isError && snippets.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>{ '{ }' }</p>
          <p>No snippets yet. <a href="/new">Create your first one.</a></p>
        </div>
      )}

      {/* Snippet list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {snippets.map((s) => (
          <SnippetCard
            key={s.id}
            snippet={s}
            onDelete={(id) => {
              if (window.confirm('Delete this snippet?')) deleteMutation.mutate(id)
            }}
          />
        ))}
      </div>

      {/* Pagination info */}
      {data?.total_pages > 1 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 24, fontSize: 13 }}>
          Showing {snippets.length} of {data.count}
        </p>
      )}
    </Layout>
  )
}