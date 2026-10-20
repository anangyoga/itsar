import type { SubjectProgress } from '~/types/quiz'

const STORAGE_KEY = 'belajar-bareng:progress:v1'

export function useProgress() {
  const progress = useState<Record<string, SubjectProgress>>('bb-progress', () => ({}))
  const loaded = useState('bb-progress-loaded', () => false)

  /** Read saved progress from the browser. Safe to call more than once. */
  function load() {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) progress.value = JSON.parse(raw) as Record<string, SubjectProgress>
    } catch {
      // Corrupt or unavailable storage: start fresh.
    }
  }

  function record(subjectId: string, score: number) {
    const previous = progress.value[subjectId]
    const next: SubjectProgress = {
      best: Math.max(previous?.best ?? 0, score),
      attempts: (previous?.attempts ?? 0) + 1,
      lastPlayed: Date.now(),
    }
    progress.value = { ...progress.value, [subjectId]: next }

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
      } catch {
        // Storage full or blocked: keep the in-memory value.
      }
    }
  }

  function bestOf(subjectId: string): number | undefined {
    return progress.value[subjectId]?.best
  }

  return { progress, load, record, bestOf }
}
