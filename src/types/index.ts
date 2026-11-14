export interface Profile {
  id: string
  email: string
  full_name: string | null
  xp: number
  streak: number
  created_at: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  module_id: string
  order_index: number
}

export interface Challenge {
  id: string
  lesson_id: string
  question: string
  code_snippet?: string
  options: string[]
  correct_answer: number
  explanation: string
}