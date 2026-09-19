import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  createPollQuestion,
  deletePollQuestion,
  listAdminPollQuestions,
  setPollQuestionPublished,
  updatePollQuestion,
} from '@/lib/admin/pollAdmin'
import { getPollResults, type PollResult } from '@/lib/poll'
import type { PollQuestionRow } from '@/lib/admin/types'

interface FormState {
  key: string
  question: string
  option1: string
  option2: string
  publishAt: string
}

const EMPTY_FORM: FormState = { key: '', question: '', option1: '', option2: '', publishAt: '' }

export function AdminPoll() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState<PollQuestionRow[]>([])
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [results, setResults] = useState<Record<string, PollResult[]>>({})

  const showForm = editingKey !== null || params.get('nuevo') === '1'

  function reload() {
    listAdminPollQuestions().then(setItems).catch(() => setItems([]))
  }
  useEffect(reload, [])

  function startNew() {
    setForm(EMPTY_FORM)
    setEditingKey(null)
    setParams({ nuevo: '1' })
  }

  function startEdit(q: PollQuestionRow) {
    setForm({
      key: q.key,
      question: q.question,
      option1: q.options[0]?.label ?? '',
      option2: q.options[1]?.label ?? '',
      publishAt: q.publishAt ?? '',
    })
    setEditingKey(q.key)
  }

  function cancelForm() {
    setEditingKey(null)
    setParams({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const options = [
      { key: 'opcion_1', label: form.option1 },
      { key: 'opcion_2', label: form.option2 },
    ]
    try {
      if (editingKey) {
        await updatePollQuestion(editingKey, { question: form.question, options, publishAt: form.publishAt })
      } else {
        const key = form.key.trim() || `pregunta_${Date.now()}`
        await createPollQuestion({ key, question: form.question, options, publishAt: form.publishAt })
      }
      cancelForm()
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido guardar.')
    }
  }

  async function loadResults(key: string) {
    const r = await getPollResults(key).catch(() => [] as PollResult[])
    setResults((prev) => ({ ...prev, [key]: r }))
  }

  return (
    <div>
      <div className="admin-item-head" style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>La pregunta de Paco</h1>
        {!showForm && (
          <button type="button" className="btn btn-primary" onClick={startNew}>
            + Nueva pregunta
          </button>
        )}
      </div>
      <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem' }}>
        Solo la más reciente que esté publicada se muestra en la web. Publica una nueva para reemplazar la anterior.
      </p>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          {!editingKey && (
            <label>
              Clave interna (opcional, se genera sola si la dejas vacía)
              <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="ej. permiso_o_amenaza" />
            </label>
          )}
          <label>
            Pregunta
            <textarea required rows={2} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </label>
          <div className="admin-form-row admin-form-row--2">
            <label>
              Respuesta 1
              <input required value={form.option1} onChange={(e) => setForm({ ...form, option1: e.target.value })} />
            </label>
            <label>
              Respuesta 2
              <input required value={form.option2} onChange={(e) => setForm({ ...form, option2: e.target.value })} />
            </label>
          </div>
          <label>
            Fecha de publicación (opcional, si la dejas vacía se ve en cuanto la publiques)
            <input type="datetime-local" value={form.publishAt} onChange={(e) => setForm({ ...form, publishAt: e.target.value })} />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancelForm}>
              Cancelar
            </button>
          </div>
          {error && <p className="form-message form-message--error">{error}</p>}
        </form>
      )}

      {items.map((q) => (
        <div key={q.key} className="admin-item">
          <div className="admin-item-head">
            <span className="admin-item-title">{q.question}</span>
            <span className={`admin-badge ${q.published ? 'admin-badge--published' : 'admin-badge--draft'}`}>
              {q.published ? 'Publicada' : 'Borrador'}
            </span>
          </div>
          {results[q.key] && (
            <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--texto-suave)' }}>
              {q.options.map((opt) => {
                const votes = results[q.key].find((r) => r.optionKey === opt.key)?.votes ?? 0
                return (
                  <div key={opt.key}>
                    {opt.label}: {votes} votos
                  </div>
                )
              })}
            </div>
          )}
          <div className="admin-item-actions">
            <button type="button" onClick={() => startEdit(q)}>
              Editar
            </button>
            <button type="button" onClick={() => loadResults(q.key)}>
              Ver resultados
            </button>
            <button type="button" onClick={() => setPollQuestionPublished(q.key, !q.published).then(reload)}>
              {q.published ? 'Despublicar' : 'Publicar'}
            </button>
            <button type="button" className="danger" onClick={() => deletePollQuestion(q.key).then(reload)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && !showForm && <p style={{ color: 'var(--texto-suave)' }}>Todavía no hay preguntas.</p>}
    </div>
  )
}
