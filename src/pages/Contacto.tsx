import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { WaitlistForm } from '@/components/WaitlistForm'
import { SOCIAL_LINKS } from '@/config/site'

export function Contacto() {
  useDocumentMeta('Contacto — PEPA Family App', 'Escríbenos o síguenos en redes para saber más de PEPA.')

  return (
    <div className="simple-page">
      <div className="container">
        <h1>Contacto</h1>
        <p style={{ color: 'var(--texto-suave)', maxWidth: '56ch' }}>
          Cuéntanos lo que quieras y te respondemos — también puedes apuntarte a la lista de espera de una vez.
        </p>
        <div style={{ marginTop: 24 }}>
          <WaitlistForm source="contacto_page" showMessage />
        </div>

        <h2>O síguenos en redes</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="btn btn-ghost">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
