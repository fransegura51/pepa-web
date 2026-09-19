import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { Pricing } from '@/components/Pricing'

export function Precios() {
  useDocumentMeta('Precios de PEPA', 'PEPA está en fase de acceso anticipado. Apúntate a la lista de espera.')

  return (
    <div className="simple-page">
      <div className="container">
        <h1>Precios</h1>
        <Pricing />
      </div>
    </div>
  )
}
