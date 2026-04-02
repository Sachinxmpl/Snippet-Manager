import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSnippet, updateSnippet } from '../api/snippets'
import Layout from '../components/Layout'
import SnippetForm from '../components/SnippetForm'

export default function EditSnippet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { data: snippet, isLoading, isError } = useQuery({
    queryKey: ['snippet', id],
    queryFn: () => getSnippet(id),
  })

  const mutation = useMutation({
    mutationFn: (data) => updateSnippet(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['snippets'] })
      qc.invalidateQueries({ queryKey: ['snippet', id] })
      navigate('/')
    },
    onError: (err) => {
      setServerError(err.response?.data?.detail || 'Failed to save changes.')
    },
  })

  if (isLoading) return (
    <Layout>
      <p style={{ color: 'var(--text-muted)', marginTop: 60, textAlign: 'center' }}>Loading…</p>
    </Layout>
  )

  if (isError) return (
    <Layout>
      <p style={{ color: 'var(--danger)', marginTop: 60, textAlign: 'center' }}>Snippet not found.</p>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Back</Link>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Edit Snippet</h2>
      </div>

      {serverError && <p className="error-msg" style={{ marginBottom: 16 }}>{serverError}</p>}

      <div className="card">
        <SnippetForm
          initial={snippet}
          onSubmit={(data) => mutation.mutate(data)}
          loading={mutation.isPending}
        />
      </div>
    </Layout>
  )
}