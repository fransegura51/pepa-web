import { supabase } from '@/lib/supabaseClient'
import type { PollQuestionRow } from '@/lib/admin/types'

function fromRow(r: { key: string; question: string; options: unknown; published: boolean; publish_at: string | null }): PollQuestionRow {
  return {
    key: r.key,
    question: r.question,
    options: r.options as { key: string; label: string }[],
    published: r.published,
    publishAt: r.publish_at,
  }
}

export async function listAdminPollQuestions(): Promise<PollQuestionRow[]> {
  const { data, error } = await supabase.from('pepa_web_poll_questions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

// La pública ("La pregunta de Paco") solo muestra una a la vez: la
// publicada más reciente ya en su fecha.
export async function getActivePollQuestion(): Promise<PollQuestionRow | null> {
  const { data, error } = await supabase
    .from('pepa_web_poll_questions')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(1)
  if (error) throw error
  return data.length > 0 ? fromRow(data[0]) : null
}

export interface PollQuestionInput {
  key: string
  question: string
  options: { key: string; label: string }[]
  publishAt: string
}

export async function createPollQuestion(input: PollQuestionInput): Promise<void> {
  const { error } = await supabase.from('pepa_web_poll_questions').insert({
    key: input.key,
    question: input.question,
    options: input.options,
    publish_at: input.publishAt || null,
  })
  if (error) throw error
}

export async function updatePollQuestion(key: string, input: Omit<PollQuestionInput, 'key'>): Promise<void> {
  const { error } = await supabase
    .from('pepa_web_poll_questions')
    .update({ question: input.question, options: input.options, publish_at: input.publishAt || null, updated_at: new Date().toISOString() })
    .eq('key', key)
  if (error) throw error
}

export async function setPollQuestionPublished(key: string, published: boolean): Promise<void> {
  const { error } = await supabase
    .from('pepa_web_poll_questions')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('key', key)
  if (error) throw error
}

export async function deletePollQuestion(key: string): Promise<void> {
  const { error } = await supabase.from('pepa_web_poll_questions').delete().eq('key', key)
  if (error) throw error
}
