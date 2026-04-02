import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSnippet } from '../api/snippets'
import Layout from '../components/Layout'
import SnippetForm from '../components/SnippetForm'

export default function CreateSnippet() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState('')

  const mutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['snippets'] })
      navigate('/')
    },
    onError: (err) => {
      setServerError(err.response?.data?.detail || 'Failed to create snippet.')
    },
  })

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Back</Link>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>New Snippet</h2>
      </div>

      {serverError && <p className="error-msg" style={{ marginBottom: 16 }}>{serverError}</p>}

      <div className="card">
        <SnippetForm onSubmit={(data) => mutation.mutate(data)} loading={mutation.isPending} />
      </div>
    </Layout>
  )
}