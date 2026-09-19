export interface PacoVideoRow {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  platform: string | null
  sortOrder: number
  featured: boolean
  published: boolean
}

export interface PromotionRow {
  id: string
  title: string
  body: string
  imageUrl: string | null
  buttonText: string | null
  buttonUrl: string | null
  startsAt: string | null
  endsAt: string | null
  published: boolean
}

export interface NewsRow {
  id: string
  title: string
  description: string
  imageUrl: string | null
  linkUrl: string | null
  publishedAt: string | null
  published: boolean
}

export interface PollQuestionRow {
  key: string
  question: string
  options: { key: string; label: string }[]
  published: boolean
  publishAt: string | null
}
