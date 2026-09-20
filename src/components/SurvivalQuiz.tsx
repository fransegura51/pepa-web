import { useState } from 'react'
import { SHOWCASE_EVENT, chaosTierFor, type ShowcaseKey } from '@/config/home'
import { QUIZ_QUESTIONS } from '@/config/content'

// Nivel de caos (0-100) a partir de los puntos acumulados. Puro y sin
// efectos: no se guarda ni se envía ninguna respuesta.
export function chaosPercent(points: number): number {
  const max = QUIZ_QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.chaosPoints)), 0)
  return Math.round((points / max) * 100)
}

function openModule(key: ShowcaseKey) {
  // El visor "Mira PEPA por dentro" escucha este evento; el ancla #por-dentro
  // del propio enlace hace el scroll.
  window.dispatchEvent(new CustomEvent(SHOWCASE_EVENT, { detail: key }))
}

// Test ligero y divertido en una tarjeta compacta. 5 preguntas, progreso
// visible y un resultado con porcentaje de caos y una frase de PEPA.
export function SurvivalQuiz() {
  const [step, setStep] = useState(0)
  const [points, setPoints] = useState(0)
  const [done, setDone] = useState(false)

  function answer(chaosPoints: number) {
    setPoints((p) => p + chaosPoints)
    if (step + 1 >= QUIZ_QUESTIONS.length) setDone(true)
    else setStep(step + 1)
  }

  function restart() {
    setStep(0)
    setPoints(0)
    setDone(false)
  }

  if (done) {
    const percent = chaosPercent(points)
    const tier = chaosTierFor(percent)
    return (
      <div className="hm-quiz hm-quiz--result" aria-live="polite">
        <p className="hm-quiz-kicker">Nivel de caos familiar</p>
        <p className="hm-quiz-percent">{percent}%</p>
        <h3 className="hm-quiz-title">{tier.title}</h3>
        <p className="hm-quiz-text">
          <strong>PEPA dice:</strong> {tier.text}
        </p>
        <p className="hm-quiz-start">
          Podéis empezar por:{' '}
          {tier.modules.map((m, i) => (
            <span key={m.key}>
              {i > 0 && ' · '}
              <a href="#por-dentro" className="hm-textlink" onClick={() => openModule(m.key)}>
                {m.name}
              </a>
            </span>
          ))}
        </p>
        <p className="hm-quiz-fine">
          Es un juego: no se guarda ninguna respuesta.{' '}
          <button type="button" className="hm-linkbutton" onClick={restart}>
            Repetir el test
          </button>
        </p>
      </div>
    )
  }

  const q = QUIZ_QUESTIONS[step]
  return (
    <div className="hm-quiz">
      <div className="hm-quiz-progress">
        <p className="hm-quiz-count">
          {`Pregunta ${step + 1} de ${QUIZ_QUESTIONS.length}`}
        </p>
        <div
          className="hm-quiz-bar"
          role="progressbar"
          aria-label="Progreso del test"
          aria-valuemin={1}
          aria-valuemax={QUIZ_QUESTIONS.length}
          aria-valuenow={step + 1}
        >
          <span style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>
      <h3 className="hm-quiz-q">{q.question}</h3>
      <div className="hm-quiz-options">
        {q.options.map((opt) => (
          <button key={opt.label} type="button" className="hm-quiz-option" onClick={() => answer(opt.chaosPoints)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
