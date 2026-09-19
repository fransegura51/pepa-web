import { Link } from 'react-router-dom'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

// Mismo texto que family-app/public/terminos.html — no se redacta legal
// nuevo para esta web.
export function Condiciones() {
  useDocumentMeta('Términos de uso — PEPA Family App', 'Condiciones de uso de PEPA Family App.')

  return (
    <div className="simple-page">
      <div className="container">
        <div className="dev-note">
          Estos son los mismos términos que usa la app. También puedes verlos en{' '}
          <a href="https://fransegura51.github.io/family-app/terminos.html" target="_blank" rel="noreferrer">
            fransegura51.github.io/family-app/terminos.html
          </a>
          .
        </div>

        <h1>Términos de uso de PEPA Family App</h1>
        <p style={{ color: 'var(--texto-suave)', fontSize: 13 }}>Versión: 11 de septiembre de 2026</p>

        <h2>1. Qué es PEPA Family App</h2>
        <p>
          Una aplicación de organización familiar (calendario, compras, alimentación, economía, documentos y fotos)
          ofrecida por <span style={{ background: '#fff3cd', padding: '0 4px' }}>[Nombre o razón social]</span> (
          <span style={{ background: '#fff3cd', padding: '0 4px' }}>[NIF/CIF]</span>,{' '}
          <span style={{ background: '#fff3cd', padding: '0 4px' }}>[Dirección]</span>). Al crear una cuenta aceptas
          estos términos y la <Link to="/privacidad">política de privacidad</Link>.
        </p>

        <h2>2. Cuenta y acceso</h2>
        <p>
          Para crear una familia hace falta un código de invitación. Eres responsable de guardar tu contraseña y de a
          quién invitas a tu familia. Quien administra la familia decide qué ven los demás miembros. Debes ser mayor
          de edad para crear una familia; los menores solo participan bajo la cuenta y el control de sus padres,
          madres o tutores.
        </p>

        <h2>3. Uso de la aplicación</h2>
        <p>
          La app es para uso personal y familiar. No puedes usarla para fines ilegales, para acceder a datos de otras
          familias, ni intentar saltarte sus medidas de seguridad. El contenido que subes (fotos, documentos,
          tickets) es tuyo y respondes de tener derecho a subirlo. Cada familia es responsable de la veracidad de los
          datos que introduce (gastos, eventos, documentos…).
        </p>

        <h2>4. Cuentas bancarias (Enable Banking)</h2>
        <p>
          Al enlazar una cuenta bancaria, la familia autoriza expresamente a Enable Banking (proveedor regulado de
          servicios de información de cuentas, bajo normativa PSD2) a compartir con esta app la lista de cuentas,
          saldos y movimientos de esa cuenta, en modo solo lectura, durante el plazo de consentimiento que se acepte
          en cada momento. Esa autorización puede revocarse en cualquier momento desde Economía → Banco, o
          directamente desde el propio banco.
        </p>

        <h2>5. Google Calendar</h2>
        <p>
          Al enlazar una cuenta de Google, la familia autoriza a la app a leer y crear eventos en su calendario,
          únicamente para mantener sincronizado el calendario familiar. Esa autorización puede revocarse en cualquier
          momento desde la app o desde la propia cuenta de Google.
        </p>

        <h2>6. Economía y responsabilidad</h2>
        <p>
          La información económica (categorías, conclusiones de Pepa, previsiones) es orientativa y se calcula a
          partir de lo que tú apuntas o de lo que devuelve tu banco; puede no ser exacta si esos datos son
          incompletos. La app no sustituye asesoramiento financiero, médico ni legal profesional.
        </p>

        <h2>7. Precio</h2>
        <p>
          <span style={{ background: '#fff3cd', padding: '0 4px' }}>
            [Durante la fase de prueba la app es gratuita para las familias invitadas. Si en el futuro se cobra una
            suscripción, se avisará con antelación dentro de la app y nunca se cobrará sin aceptación expresa.]
          </span>
        </p>

        <h2>8. Disponibilidad</h2>
        <p>
          La app se ofrece "tal cual", sin garantía de disponibilidad continua ni de ausencia de errores, y puede
          cambiar o retirarse alguna función. En la medida que permita la ley, no respondemos de daños indirectos
          derivados del uso de la app (por ejemplo, una cita mal apuntada o un cálculo económico orientativo).
          Recomendamos comprobar siempre los datos importantes.
        </p>

        <h2>9. Baja</h2>
        <p>
          Puedes dejar de usar la app y pedir el borrado de tu cuenta y la de tu familia cuando quieras escribiéndonos
          por el formulario de <Link to="/contacto">contacto</Link>. Podemos suspender cuentas que incumplan estos
          términos.
        </p>

        <h2>10. Ley aplicable</h2>
        <p>Estos términos se rigen por la legislación española. Para cualquier conflicto, los juzgados del domicilio del usuario.</p>

        <p style={{ color: 'var(--texto-suave)', fontSize: 13 }}>
          <Link to="/privacidad">Ver la política de privacidad →</Link>
        </p>
      </div>
    </div>
  )
}
