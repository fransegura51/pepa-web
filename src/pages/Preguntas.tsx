import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { Faq } from '@/components/Faq'

export function Preguntas() {
  useDocumentMeta('Preguntas frecuentes — PEPA Family App', 'Qué es PEPA, cómo funciona, privacidad y disponibilidad.')

  return (
    <div className="simple-page">
      <div className="container">
        <h1>Preguntas frecuentes</h1>
        <Faq />
      </div>
    </div>
  )
}
