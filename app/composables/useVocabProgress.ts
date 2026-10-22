import type { VocabProgress } from '~/types/vocab'

const STORAGE_KEY = 'belajar-bareng:vocab-progress:v1'

export interface VocabRoundResult {
  /** Only full rounds update the saved best score. */
  score?: number
  /** Word IDs answered correctly during the round. */
  mastered: string[]
}

export function useVocabProgress() {
  const progress = useState<Record<string, VocabProgress>>('bb-vocab-progress', () => ({}))
  const loaded = useState('bb-vocab-progress-loaded', () => false)

  /** Read saved progress from the browser. Safe to call more than once. */
  function load() {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) progress.value = JSON.parse(raw) as Record<string, VocabProgress>
    } catch {
      // Corrupt or unavailable storage: start fresh.
    }
  }

  function record(categoryId: string, result: VocabRoundResult) {
    const previous = progress.value[categoryId]
    const mastered = Array.from(new Set([...(previous?.mastered ?? []), ...result.mastered]))
    const score = result.score

    const next: VocabProgress = {
      best: score !== undefined ? Math.max(previous?.best ?? 0, score) : (previous?.best ?? 0),
      attempts: (previous?.attempts ?? 0) + (score !== undefined ? 1 : 0),
      lastPlayed: score !== undefined ? Date.now() : (previous?.lastPlayed ?? 0),
      mastered,
    }

    progress.value = { ...progress.value, [categoryId]: next }

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
      } catch {
        // Storage full or blocked: keep the in-memory value.
      }
    }
  }

  return { progress, load, record }
}
