import { WaitlistForm } from '@/components/WaitlistForm'
import { EDITABLE_TEXTS } from '@/lib/admin/texts'
import { useText } from '@/context/EditableTextsContext'

const TITLE_DEFAULT = EDITABLE_TEXTS.find((t) => t.key === 'final_cta_title')!.fallback

export function FinalCta() {
  const title = useText('final_cta_title', TITLE_DEFAULT)

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{title}</h2>
      <p style={{ color: 'var(--texto-suave)', maxWidth: '48ch', margin: '0 auto 24px' }}>
        Únete a las familias que ya están probando PEPA.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <WaitlistForm source="final_cta" />
      </div>
    </div>
  )
}
