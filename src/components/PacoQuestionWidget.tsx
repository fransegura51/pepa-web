import { useEffect, useState } from 'react'
import { PACO_QUESTION } from '@/config/content'
import { castVote, getPollResults, getVotedOption, hasVoted, markVoted, type PollResult } from '@/lib/poll'

export function PacoQuestionWidget() {
  const [voted, setVoted] = useState(() => hasVoted(PACO_QUESTION.key))
  const [myOption, setMyOption] = useState<string | null>(() => getVotedOption(PACO_QUESTION.key))
  const [results, setResults] = useState<PollResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!voted) return
    setLoading(true)
    getPollResults(PACO_QUESTION.key)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [voted])

  async function vote(optionKey: string) {
    setMyOption(optionKey)
    setVoted(true)
    markVoted(PACO_QUESTION.key, optionKey)
    try {
      await castVote(PACO_QUESTION.key, optionKey)
    } catch {
      // El voto local ya quedó registrado para esta persona; si falla el
      // envío, simplemente no suma al recuento público — nada que
      // bloquee su experiencia por un fallo de red puntual.
    }
  }

  const totalVotes = results?.reduce((sum, r) => sum + r.votes, 0) ?? 0

  return (
    <div className="poll-card">
      <p className="eyebrow">La pregunta de Paco</p>
      <h2 style={{ fontSize: '1.4rem' }}>{PACO_QUESTION.question}</h2>

      {!voted ? (
        <div className="poll-options">
          {PACO_QUESTION.options.map((opt) => (
            <button key={opt.key} type="button" className="poll-option" onClick={() => vote(opt.key)}>
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {loading && <p>Contando votos…</p>}
          {!loading &&
            PACO_QUESTION.options.map((opt) => {
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
          {!loading && <p style={{ color: 'var(--texto-suave)', fontSize: '0.85rem' }}>{totalVotes} votos hasta ahora.</p>}
        </div>
      )}
    </div>
  )
}
