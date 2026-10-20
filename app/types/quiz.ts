export type ThemeName = 'sun' | 'sky' | 'grass' | 'grape' | 'berry'

/** Shape of one question inside a subject JSON file. */
export interface Question {
  id?: string
  /** Optional reading passage / story shown above the question. */
  passage?: string
  question: string
  options: string[]
  /** Index of the correct option inside `options` (0-based). */
  answer: number
  explanation?: string
}

/** Shape of `data/subjects/<name>.json`. */
export interface Subject {
  id: string
  name: string
  emoji: string
  theme?: ThemeName
  grade?: string
  description?: string
  /** Lower number shows first on the home screen. */
  order?: number
  questions: Question[]
}

/** A question that has been shuffled for a play session. */
export interface QuizQuestion extends Question {
  options: string[]
  answer: number
}

export interface SubjectProgress {
  best: number
  attempts: number
  lastPlayed: number
}
