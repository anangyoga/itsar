import type { ThemeName } from './quiz'

/** One Indonesian → English word pair inside a category. */
export interface VocabWord {
  id: string
  /** Indonesian word shown to the child. */
  prompt: string
  /** Canonical English spelling shown after answering. */
  answer: string
  /** Extra spellings that are also accepted (e.g. "fridge" for "refrigerator"). */
  accept?: string[]
  /** Example sentence shown after answering. */
  example?: string
}

/** Shape of `data/vocab/<category>.json`. */
export interface VocabCategory {
  id: string
  name: string
  /** English name of the category, shown as a small subtitle. */
  nameEn?: string
  emoji: string
  theme?: ThemeName
  description?: string
  /** Lower number shows first on the category screen. */
  order?: number
  words: VocabWord[]
}

export interface VocabProgress {
  best: number
  attempts: number
  lastPlayed: number
  /** IDs of words that have been answered correctly at least once. */
  mastered: string[]
}
