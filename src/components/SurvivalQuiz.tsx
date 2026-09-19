import { useState } from 'react'
import { QUIZ_QUESTIONS } from '@/config/content'

interface Result {
  title: string
  text: string
  modules: string[]
}

function resultFor(points: number, max: number): Result {
  const ratio = points / max
  if (ratio < 0.35) {
    return {
      title: 'Caos bajo control 🌿',
      text: 'Vuestra familia ya está bastante organizada. PEPA le pone el último toque: menos cosas sueltas por apuntar a mano.',
      modules: ['Calendario', 'Compras'],
    }
  }
  if (ratio < 0.7) {
    return {
      title: 'Caos moderado — supervivencia posible 😅',
      text: 'Hay días buenos y días de "¿quién iba a por el niño?". PEPA reparte lo que hace falta y avisa antes de que se os olvide.',
      modules: ['Calendario', 'Economía', 'Cocina'],
    }
  }
  return {
    title: 'Caos nivel experto 🌪️',
    text: 'Vuestra familia es justo el reto para el que se hizo PEPA. Con calendario, compras, economía y eventos en un solo sitio, se nota rápido.',
    modules: ['Calendario', 'Compras', 'Economía', 'Eventos'],
  }
}

export function SurvivalQuiz() {
  const [step, setStep] = useState(0)
  const [points, setPoints] = useState(0)
  const [done, setDone] = useState(false)

  const maxPoints = QUIZ_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.chaosPoints)), 0)

  function answer(chaosPoints: number) {
    const next = points + chaosPoints
    setPoints(next)
    if (step + 1 >= QUIZ_QUESTIONS.length) {
      setDone(true)
    } else {
      setStep(step + 1)
    }
  }

  function restart() {
    setStep(0)
    setPoints(0)
    setDone(false)
  }

  if (done) {
    const result = resultFor(points, maxPoints)
    return (
      <div className="quiz-card quiz-result">
        <p className="eyebrow">Resultado (con humor, no es un diagnóstico real)</p>
        <h3>{result.title}</h3>
        <p>{result.text}</p>
        <p style={{ fontWeight: 700, color: 'var(--marino)' }}>Os vendría bien empezar por: {result.modules.join(' · ')}</p>
        <div className="hero-cta-row">
          <a href="#lista-de-espera" className="btn btn-primary">
            Probar PEPA gratis →
          </a>
          <button type="button" className="btn btn-ghost" onClick={restart}>
            Repetir el test
          </button>
        </div>
      </div>
    )
  }

  const q = QUIZ_QUESTIONS[step]
  return (
    <div className="quiz-card">
      <p className="quiz-progress">
        Pregunta {step + 1} de {QUIZ_QUESTIONS.length}
      </p>
      <h3>{q.question}</h3>
      <div className="quiz-options">
        {q.options.map((opt) => (
          <button key={opt.label} type="button" className="quiz-option" onClick={() => answer(opt.chaosPoints)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
