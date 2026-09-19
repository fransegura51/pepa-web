import { supabase } from '@/lib/supabaseClient'

export interface PollResult {
  optionKey: string
  votes: number
}

export async function castVote(questionKey: string, optionKey: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_poll_votes').insert({ question_key: questionKey, option_key: optionKey })
  if (error) throw error
}

export async function getPollResults(questionKey: string): Promise<PollResult[]> {
  // Función security definer (ver 0121_pepa_web_poll_votes.sql): da el
  // recuento agregado sin exponer filas individuales de voto.
  const { data, error } = await supabase.rpc('get_pepa_web_poll_results', { p_question_key: questionKey })
  if (error) throw error
  return data.map((r) => ({ optionKey: r.option_key, votes: Number(r.votes) }))
}

// El propio dispositivo recuerda si ya votó esta pregunta, para no
// volver a pedirle voto — no es antifraude real, solo evita el caso
// tonto de votar sin querer dos veces (Skill: "sin sistemas invasivos").
const VOTED_KEY_PREFIX = 'pepa_web_voted_'

export function hasVoted(questionKey: string): boolean {
  try {
    return localStorage.getItem(VOTED_KEY_PREFIX + questionKey) !== null
  } catch {
    return false
  }
}

export function markVoted(questionKey: string, optionKey: string): void {
  try {
    localStorage.setItem(VOTED_KEY_PREFIX + questionKey, optionKey)
  } catch {
    // Modo privado / almacenamiento bloqueado: sin memoria entre
    // visitas, pero la web sigue funcionando igual.
  }
}

export function getVotedOption(questionKey: string): string | null {
  try {
    return localStorage.getItem(VOTED_KEY_PREFIX + questionKey)
  } catch {
    return null
  }
}
