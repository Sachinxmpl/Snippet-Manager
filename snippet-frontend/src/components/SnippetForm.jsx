import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTags, createTag } from '../api/snippets'
import TagBadge from './TagBadge'

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'rust', 'go',
  'java', 'c', 'cpp', 'css', 'html', 'bash', 'sql', 'other',
]

export default function SnippetForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    code: initial.code || '',
    language: initial.language || 'python',
    is_public: initial.is_public ?? false,
    tag_ids: initial.tags?.map((t) => t.id) || [],
  })
  const [newTag, setNewTag] = useState('')
  const [tagError, setTagError] = useState('')

  const { data: allTags = [], refetch: refetchTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
  }

  const toggleTag = (id) => {
    setForm((f) => ({
      ...f,
      tag_ids: f.tag_ids.includes(id)
        ? f.tag_ids.filter((t) => t !== id)
        : [...f.tag_ids, id],
    }))
  }

  const handleAddTag = async (e) => {
    e.preventDefault()
    if (!newTag.trim()) return
    setTagError('')
    try {
      const tag = await createTag(newTag.trim())
      await refetchTags()
      setForm((f) => ({ ...f, tag_ids: [...f.tag_ids, tag.id] }))
      setNewTag('')
    } catch (err) {
      setTagError(err.response?.data?.name?.[0] || 'Failed to create tag')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const selectedTags = allTags.filter((t) => form.tag_ids.includes(t.id))
  const unselectedTags = allTags.filter((t) => !form.tag_ids.includes(t.id))

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div className="form-group">
        <label>Title *</label>
        <input value={form.title} onChange={set('title')} required placeholder="e.g. Django auth middleware" />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input value={form.description} onChange={set('description')} placeholder="Optional short description" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Language *</label>
          <select value={form.language} onChange={set('language')}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, justifyContent: 'flex-end' }}>
          <label>&nbsp;</label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', textTransform: 'none', letterSpacing: 0,
            color: 'var(--text)', fontSize: 14,
          }}>
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={set('is_public')}
              style={{ width: 'auto', accentColor: 'var(--accent)' }}
            />
            Make public
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Code *</label>
        <textarea
          value={form.code}
          onChange={set('code')}
          required
          rows={14}
          placeholder="Paste your code here…"
          spellCheck={false}
        />
      </div>

      {/* Tags */}
      <div className="form-group" style={{ gap: 10 }}>
        <label>Tags</label>

        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {selectedTags.map((t) => (
              <TagBadge key={t.id} name={t.name} onRemove={() => toggleTag(t.id)} />
            ))}
          </div>
        )}

        {/* Available tags */}
        {unselectedTags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {unselectedTags.map((t) => (
              <span
                key={t.id}
                onClick={() => toggleTag(t.id)}
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--border)',
                  borderRadius: 4,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: '2px 8px',
                }}
              >
                + {t.name}
              </span>
            ))}
          </div>
        )}

        {/* Create new tag */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag name…"
            style={{ maxWidth: 200 }}
          />
          <button type="button" className="btn-ghost" onClick={handleAddTag} style={{ whiteSpace: 'nowrap' }}>
            Add tag
          </button>
        </div>
        {tagError && <span className="error-msg">{tagError}</span>}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save Snippet'}
        </button>
      </div>
    </form>
  )
}