import { useState, type Dispatch, type FormEvent } from 'react'
import { BIRTHDAY, CATEGORIES, INCOMES, MEMBERS, MENU, WEEK_DAYS, WEEK_DAYS_LONG, memberById, type CategoryId, type MemberId } from '@/demo/data'
import {
  birthdayBudgetSpent,
  categoryRows,
  dayDate,
  eventsOfDay,
  formatEuros,
  pepaBudgetConclusion,
  shoppingPending,
  totalIncome,
  totalSpent,
  type DemoAction,
  type DemoState,
} from '@/demo/state'

export interface ScreenProps {
  state: DemoState
  dispatch: Dispatch<DemoAction>
  today: Date
  todayIndex: number
}

function MemberDots({ ids }: { ids: MemberId[] }) {
  return (
    <span className="dm-dots" aria-label={ids.map((id) => memberById(id).name).join(', ')}>
      {ids.map((id) => (
        <span key={id} className="dm-dot" style={{ background: memberById(id).color }} title={memberById(id).name} />
      ))}
    </span>
  )
}

function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="dm-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="dm-progress-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ---------------------------------------------------------------- Inicio

export function InicioScreen({ state, dispatch, todayIndex }: ScreenProps) {
  const todays = eventsOfDay(state.events, todayIndex)
  const pending = shoppingPending(state.shopping)
  const left = Math.round((totalIncome() - totalSpent(state.expenses)) * 100) / 100
  const tasksDone = state.birthdayTasks.filter((t) => t.done).length

  return (
    <div className="dm-stack">
      <section className="dm-card dm-card--pepa">
        <p className="dm-pepa-line">
          <span aria-hidden="true">🐣</span> ¡Hola, familia Navarro! Esto es lo que os espera hoy.
        </p>
      </section>

      <button type="button" className="dm-card dm-card--link" onClick={() => dispatch({ type: 'goTab', tab: 'calendario' })}>
        <span className="dm-card-title">📅 Hoy en el calendario</span>
        {todays.length === 0 ? (
          <span className="dm-muted">Hoy no hay nada apuntado. ¡Día libre!</span>
        ) : (
          <ul className="dm-mini-list">
            {todays.slice(0, 3).map((e) => (
              <li key={e.id}>
                <strong>{e.time}</strong> {e.title}
              </li>
            ))}
          </ul>
        )}
      </button>

      <div className="dm-grid2">
        <button type="button" className="dm-card dm-card--link" onClick={() => dispatch({ type: 'goTab', tab: 'compras' })}>
          <span className="dm-card-title">🛒 Compra</span>
          <span className="dm-big">{pending}</span>
          <span className="dm-muted">cosas pendientes</span>
        </button>
        <button type="button" className="dm-card dm-card--link" onClick={() => dispatch({ type: 'goTab', tab: 'economia' })}>
          <span className="dm-card-title">💶 Este mes</span>
          <span className="dm-big">{formatEuros(left)}</span>
          <span className="dm-muted">libres</span>
        </button>
      </div>

      <button type="button" className="dm-card dm-card--link" onClick={() => dispatch({ type: 'goTab', tab: 'cumpleanos' })}>
        <span className="dm-card-title">🎂 Próximo cumpleaños</span>
        <span>
          {BIRTHDAY.who} cumple {BIRTHDAY.turns} en <strong>{BIRTHDAY.daysAhead} días</strong>
        </span>
        <span className="dm-muted">
          {tasksDone} de {state.birthdayTasks.length} tareas listas
        </span>
      </button>

      <button type="button" className="dm-card dm-card--link" onClick={() => dispatch({ type: 'goTab', tab: 'cocina' })}>
        <span className="dm-card-title">🍳 Cocina</span>
        <span className="dm-muted">Planifica el menú y conviértelo en lista de la compra.</span>
      </button>
    </div>
  )
}

// ------------------------------------------------------------ Calendario

export function CalendarioScreen({ state, dispatch, today, todayIndex }: ScreenProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('17:00')
  const [who, setWho] = useState<MemberId | 'todos'>('todos')
  const events = eventsOfDay(state.events, state.selectedDay)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch({
      type: 'addEvent',
      title,
      day: state.selectedDay,
      time,
      memberIds: who === 'todos' ? MEMBERS.map((m) => m.id) : [who],
    })
    setTitle('')
  }

  return (
    <div className="dm-stack">
      <div className="dm-week" role="group" aria-label="Días de la semana">
        {WEEK_DAYS.map((label, day) => {
          const count = state.events.filter((e) => e.day === day).length
          return (
            <button
              key={label}
              type="button"
              className={`dm-day${state.selectedDay === day ? ' is-selected' : ''}${todayIndex === day ? ' is-today' : ''}`}
              aria-pressed={state.selectedDay === day}
              aria-label={`${WEEK_DAYS_LONG[day]} ${dayDate(today, day).getDate()}, ${count} evento${count === 1 ? '' : 's'}`}
              onClick={() => dispatch({ type: 'selectDay', day })}
            >
              <span className="dm-day-name">{label}</span>
              <span className="dm-day-num">{dayDate(today, day).getDate()}</span>
              <span className="dm-day-count" aria-hidden="true">
                {'•'.repeat(Math.min(count, 3))}
              </span>
            </button>
          )
        })}
      </div>

      <ul className="dm-legend" aria-label="Miembros de la familia">
        {MEMBERS.map((m) => (
          <li key={m.id}>
            <span className="dm-dot" style={{ background: m.color }} /> {m.name}
          </li>
        ))}
      </ul>

      <section className="dm-card">
        <h2 className="dm-h2">
          {WEEK_DAYS_LONG[state.selectedDay]} {dayDate(today, state.selectedDay).getDate()}
        </h2>
        {events.length === 0 ? (
          <p className="dm-muted">Nada apuntado este día.</p>
        ) : (
          <ul className="dm-events">
            {events.map((e) => (
              <li key={e.id} className="dm-event">
                <span className="dm-event-time">{e.time}</span>
                <span className="dm-event-body">
                  <strong>{e.title}</strong>
                  {e.place && <span className="dm-muted"> · {e.place}</span>}
                </span>
                <MemberDots ids={e.memberIds} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <form className="dm-card dm-form" onSubmit={submit}>
        <h3 className="dm-h3">Apuntar un evento este día</h3>
        <label className="dm-field">
          <span>Qué</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Ej.: Pediatra" required />
        </label>
        <div className="dm-row">
          <label className="dm-field">
            <span>Hora</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="dm-field">
            <span>Quién</span>
            <select value={who} onChange={(e) => setWho(e.target.value as MemberId | 'todos')}>
              <option value="todos">Toda la familia</option>
              {MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Añadir evento
        </button>
      </form>
    </div>
  )
}

// --------------------------------------------------------------- Compras

const STORES = ['Mercadona', 'Carnicería', 'Pescadería', 'Farmacia', 'Otras']

export function ComprasScreen({ state, dispatch }: ScreenProps) {
  const [name, setName] = useState('')
  const [store, setStore] = useState('Mercadona')
  const done = state.shopping.filter((s) => s.done).length
  const stores = [...new Set(state.shopping.map((s) => s.store))]

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    dispatch({ type: 'addShopping', name, store })
    setName('')
  }

  return (
    <div className="dm-stack">
      <section className="dm-card">
        <p className="dm-card-title">
          {done} de {state.shopping.length} en el carrito
        </p>
        <Progress value={done} max={state.shopping.length} label="Compra completada" />
      </section>

      {stores.map((s) => (
        <section key={s} className="dm-card">
          <h2 className="dm-h2">{s}</h2>
          <ul className="dm-checklist">
            {state.shopping
              .filter((item) => item.store === s)
              .map((item) => (
                <li key={item.id}>
                  <label className={item.done ? 'is-done' : ''}>
                    <input type="checkbox" checked={item.done} onChange={() => dispatch({ type: 'toggleShopping', id: item.id })} />
                    <span>{item.name}</span>
                  </label>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <form className="dm-card dm-form" onSubmit={submit}>
        <h3 className="dm-h3">Añadir a la lista</h3>
        <div className="dm-row">
          <label className="dm-field">
            <span>Producto</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Ej.: Manzanas" required />
          </label>
          <label className="dm-field">
            <span>Tienda</span>
            <select value={store} onChange={(e) => setStore(e.target.value)}>
              {STORES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Añadir
        </button>
      </form>
    </div>
  )
}

// -------------------------------------------------------------- Economía

export function EconomiaScreen({ state, dispatch }: ScreenProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<CategoryId>('comida')
  const rows = categoryRows(state.expenses)
  const spent = totalSpent(state.expenses)
  const income = totalIncome()

  function submit(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!title.trim() || !Number.isFinite(value) || value <= 0) return
    dispatch({ type: 'addExpense', title, category, amount: value })
    setTitle('')
    setAmount('')
  }

  return (
    <div className="dm-stack">
      <div className="dm-grid3">
        <div className="dm-card dm-tile">
          <span className="dm-muted">Ingresos</span>
          <strong className="dm-big dm-ok">{formatEuros(income)}</strong>
        </div>
        <div className="dm-card dm-tile">
          <span className="dm-muted">Gastos</span>
          <strong className="dm-big">{formatEuros(spent)}</strong>
        </div>
        <div className="dm-card dm-tile">
          <span className="dm-muted">Libres</span>
          <strong className="dm-big">{formatEuros(Math.round((income - spent) * 100) / 100)}</strong>
        </div>
      </div>

      <section className="dm-card dm-card--pepa" aria-label="Conclusión de Pepa">
        <p className="dm-pepa-line">
          <span aria-hidden="true">🐣</span> {pepaBudgetConclusion(state.expenses)}
        </p>
      </section>

      <section className="dm-card">
        <h2 className="dm-h2">Presupuesto del mes</h2>
        <ul className="dm-bars">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="dm-bar-head">
                <span>
                  {r.emoji} {r.name}
                </span>
                <span className={r.ratio > 1 ? 'dm-bad' : 'dm-muted'}>
                  {formatEuros(r.spent)} / {formatEuros(r.budget)}
                </span>
              </div>
              <div
                className={`dm-progress${r.ratio > 1 ? ' is-over' : r.ratio > 0.85 ? ' is-close' : ''}`}
                role="progressbar"
                aria-label={`${r.name}: ${Math.round(r.ratio * 100)}% del presupuesto`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.round(r.ratio * 100))}
              >
                <div className="dm-progress-bar" style={{ width: `${Math.min(100, r.ratio * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <form className="dm-card dm-form" onSubmit={submit}>
        <h3 className="dm-h3">Apuntar un gasto</h3>
        <label className="dm-field">
          <span>Concepto</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Ej.: Zapatillas de Hugo" required />
        </label>
        <div className="dm-row">
          <label className="dm-field">
            <span>Importe (€)</span>
            <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" required />
          </label>
          <label className="dm-field">
            <span>Categoría</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="dm-row dm-row--buttons">
          <button type="submit" className="btn btn-primary">
            Añadir gasto
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'blocked', what: 'subir la foto de un ticket' })}>
            📷 Foto del ticket
          </button>
        </div>
      </form>

      <section className="dm-card">
        <h2 className="dm-h2">Ingresos y últimos gastos</h2>
        <ul className="dm-ledger">
          {INCOMES.map((i) => (
            <li key={i.id}>
              <span>{i.title}</span>
              <strong className="dm-ok">+{formatEuros(i.amount)}</strong>
            </li>
          ))}
          {[...state.expenses]
            .reverse()
            .slice(0, 6)
            .map((x) => (
              <li key={x.id}>
                <span>{x.title}</span>
                <strong>−{formatEuros(x.amount)}</strong>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------- Cocina

export function CocinaScreen({ state, dispatch }: ScreenProps) {
  return (
    <div className="dm-stack">
      <section className="dm-card dm-card--pepa">
        <p className="dm-pepa-line">
          <span aria-hidden="true">🐣</span> Menú de la semana. Pulsa "Añadir a la compra" y solo apunto lo que aún no tienes en la lista.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'addWeekToShopping' })}>
          Añadir toda la semana a la compra
        </button>
      </section>

      {MENU.map((m) => (
        <section key={m.id} className="dm-card">
          <h2 className="dm-h2">{WEEK_DAYS_LONG[m.day]}</h2>
          <dl className="dm-menu">
            <dt>Comida</dt>
            <dd>{m.lunch}</dd>
            <dt>Cena</dt>
            <dd>{m.dinner}</dd>
          </dl>
          <p className="dm-muted dm-ingredients">Ingredientes: {m.ingredients.map((i) => i.name).join(', ')}</p>
          <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'addMenuToShopping', menuId: m.id })}>
            Añadir a la compra
          </button>
        </section>
      ))}

      <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'goTab', tab: 'compras' })}>
        Ver la lista de la compra ({shoppingPending(state.shopping)} pendientes)
      </button>
    </div>
  )
}

// ------------------------------------------------------------ Cumpleaños

export function CumpleanosScreen({ state, dispatch }: ScreenProps) {
  const tasksDone = state.birthdayTasks.filter((t) => t.done).length
  const confirmed = state.birthdayGuests.filter((g) => g.confirmed).length
  const spent = birthdayBudgetSpent(state.birthdayBudget)

  return (
    <div className="dm-stack">
      <section className="dm-card dm-birthday-hero">
        <p className="dm-muted">🎂 {BIRTHDAY.place}</p>
        <h2 className="dm-h2">Cumpleaños de {BIRTHDAY.who}</h2>
        <p className="dm-countdown">
          <strong>{BIRTHDAY.daysAhead}</strong> días para que cumpla {BIRTHDAY.turns}
        </p>
      </section>

      <section className="dm-card">
        <h3 className="dm-h3">
          Tareas ({tasksDone}/{state.birthdayTasks.length})
        </h3>
        <Progress value={tasksDone} max={state.birthdayTasks.length} label="Tareas del cumpleaños" />
        <ul className="dm-checklist">
          {state.birthdayTasks.map((t) => (
            <li key={t.id}>
              <label className={t.done ? 'is-done' : ''}>
                <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggleTask', id: t.id })} />
                <span>{t.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="dm-card">
        <h3 className="dm-h3">
          Invitados ({confirmed}/{state.birthdayGuests.length} confirmados)
        </h3>
        <ul className="dm-checklist">
          {state.birthdayGuests.map((g) => (
            <li key={g.id}>
              <label className={g.confirmed ? '' : 'is-pending'}>
                <input type="checkbox" checked={g.confirmed} onChange={() => dispatch({ type: 'toggleGuest', id: g.id })} />
                <span>
                  {g.name} <span className="dm-muted">{g.confirmed ? '· viene' : '· sin confirmar'}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'blocked', what: 'enviar invitaciones' })}>
          ✉️ Enviar recordatorio a los pendientes
        </button>
      </section>

      <section className="dm-card">
        <h3 className="dm-h3">Presupuesto</h3>
        <div className="dm-bar-head">
          <span>Gastado</span>
          <span className={spent > BIRTHDAY.budget ? 'dm-bad' : 'dm-muted'}>
            {formatEuros(spent)} / {formatEuros(BIRTHDAY.budget)}
          </span>
        </div>
        <Progress value={spent} max={BIRTHDAY.budget} label="Presupuesto del cumpleaños" />
        <ul className="dm-ledger">
          {state.birthdayBudget.map((l) => (
            <li key={l.id}>
              <span>{l.title}</span>
              <strong>{formatEuros(l.amount)}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
