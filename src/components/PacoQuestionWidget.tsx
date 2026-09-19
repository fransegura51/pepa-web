import { useEffect, useState } from 'react'
import { getActivePollQuestion } from '@/lib/admin/pollAdmin'
import type { PollQuestionRow } from '@/lib/admin/types'
import { castVote, getPollResults, getVotedOption, hasVoted, markVoted, type PollResult } from '@/lib/poll'

export function PacoQuestionWidget() {
  const [question, setQuestion] = useState<PollQuestionRow | null | undefined>(undefined)
  const [voted, setVoted] = useState(false)
  const [myOption, setMyOption] = useState<string | null>(null)
  const [results, setResults] = useState<PollResult[] | null>(null)
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    getActivePollQuestion()
      .then((q) => {
        setQuestion(q)
        if (q) {
          setVoted(hasVoted(q.key))
          setMyOption(getVotedOption(q.key))
        }
      })
      .catch(() => setQuestion(null))
  }, [])

  useEffect(() => {
    if (!question || !voted) return
    setLoadingResults(true)
    getPollResults(question.key)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoadingResults(false))
  }, [question, voted])

  async function vote(optionKey: string) {
    if (!question) return
    setMyOption(optionKey)
    setVoted(true)
    markVoted(question.key, optionKey)
    try {
      await castVote(question.key, optionKey)
    } catch {
      // El voto local ya quedó registrado para esta persona; si falla el
      // envío, simplemente no suma al recuento público.
    }
  }

  if (question === undefined || question === null) return null

  const totalVotes = results?.reduce((sum, r) => sum + r.votes, 0) ?? 0

  return (
    <div className="poll-card">
      <p className="eyebrow">La pregunta de Paco</p>
      <h2 style={{ fontSize: '1.4rem' }}>{question.question}</h2>

      {!voted ? (
        <div className="poll-options">
          {question.options.map((opt) => (
            <button key={opt.key} type="button" className="poll-option" onClick={() => vote(opt.key)}>
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {loadingResults && <p>Contando votos…</p>}
          {!loadingResults &&
            question.options.map((opt) => {
              const votes = results?.find((r) => r.optionKey === opt.key)?.votes ?? 0
              const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
              return (
                <div key={opt.key} className="poll-result-row">
                  <span>
                    {opt.label} {opt.key === myOption ? '(tu voto)' : ''} — {pct}%
                  </span>
                  <div className="poll-result-bar">
                    <div className="poll-result-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          {!loadingResults && <p style={{ color: 'var(--texto-suave)', fontSize: '0.85rem' }}>{totalVotes} votos hasta ahora.</p>}
        </div>
      )}
    </div>
  )
}
