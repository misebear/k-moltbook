export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
}
