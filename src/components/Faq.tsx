import { FAQ_ITEMS } from '@/config/content'

export function Faq() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {FAQ_ITEMS.map((item) => (
        <details key={item.question} className="faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
