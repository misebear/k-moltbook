import { supabase } from '@/lib/supabase'
import { PromptDetail } from '@/components/PromptDetail'
import { notFound } from 'next/navigation'

export const revalidate = 300 // 5분 캐싱

export default async function PromptPage({ params }: { params: { id: string } }) {
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!prompt) return notFound()

  // 조회수 증가
  await supabase.rpc('increment_views', { prompt_id: params.id })

  return <PromptDetail prompt={prompt} />
}
