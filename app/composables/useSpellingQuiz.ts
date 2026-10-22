import type { VocabCategory, VocabWord } from '~/types/vocab'

export type SpellingStatus = 'idle' | 'near' | 'correct' | 'wrong'

export interface SpellingRecord {
  word: VocabWord
  /** What the child typed on the final attempt. */
  typed: string
  correct: boolean
}

export function useSpellingQuiz(category: Ref<VocabCategory | undefined>) {
  const { record } = useVocabProgress()
  const sound = useSound()

  const words = ref<VocabWord[]>([])
  const current = ref(0)
  /** Bound to the input field. */
  const typed = ref('')
  const status = ref<SpellingStatus>('idle')
  const usedRetry = ref(false)
  const records = ref<SpellingRecord[]>([])
  const finished = ref(false)
  const startedAt = ref(0)
  const durationSeconds = ref(0)
  const fullRound = ref(true)

  const total = computed(() => words.value.length)
  const word = computed<VocabWord | undefined>(() => words.value[current.value])
  const isResolved = computed(() => status.value === 'correct' || status.value === 'wrong')
  const isLast = computed(() => current.value >= total.value - 1)
  const correctCount = computed(() => records.value.filter(item => item.correct).length)
  const wrongRecords = computed(() => records.value.filter(item => !item.correct))
  const score = computed(() =>
    total.value === 0 ? 0 : Math.round((correctCount.value / total.value) * 100),
  )
  const progressPercent = computed(() =>
    total.value === 0 ? 0 : ((current.value + 1) / total.value) * 100,
  )

  function start(source?: VocabWord[], options: { fullRound?: boolean } = {}) {
    const pool = source ?? category.value?.words ?? []
    words.value = shuffle(pool)

    current.value = 0
    typed.value = ''
    status.value = 'idle'
    usedRetry.value = false
    records.value = []
    finished.value = false
    durationSeconds.value = 0
    startedAt.value = Date.now()
    fullRound.value = options.fullRound ?? true
  }

  function submit(value: string): SpellingStatus | null {
    const active = word.value
    if (!active || finished.value || isResolved.value) return null

    const answer = normalizeAnswer(value)
    if (!answer) return null

    const accepted = [active.answer, ...(active.accept ?? [])].map(normalizeAnswer)

    if (accepted.includes(answer)) {
      typed.value = value.trim()
      status.value = 'correct'
      records.value.push({ word: active, typed: value.trim(), correct: true })
      sound.playCorrect()
      return 'correct'
    }

    // One friendly retry when the spelling is only a single typo away.
    if (!usedRetry.value && accepted.some(expected => isNearMiss(answer, expected))) {
      usedRetry.value = true
      typed.value = value.trim()
      status.value = 'near'
      sound.playRetry()
      return 'near'
    }

    typed.value = value.trim()
    status.value = 'wrong'
    records.value.push({ word: active, typed: value.trim(), correct: false })
    sound.playWrong()
    return 'wrong'
  }

  function next() {
    if (!isResolved.value) return
    if (isLast.value) {
      finish()
      return
    }
    current.value += 1
    typed.value = ''
    status.value = 'idle'
    usedRetry.value = false
  }

  function finish() {
    if (finished.value) return
    finished.value = true
    durationSeconds.value = Math.round((Date.now() - startedAt.value) / 1000)
    sound.playFinish()

    if (category.value) {
      record(category.value.id, {
        score: fullRound.value ? score.value : undefined,
        mastered: records.value.filter(item => item.correct).map(item => item.word.id),
      })
    }
  }

  function restart() {
    start()
  }

  function retryWrong() {
    const missed = wrongRecords.value.map(item => item.word)
    if (!missed.length) return
    start(missed, { fullRound: false })
  }

  return {
    words,
    current,
    word,
    typed,
    status,
    records,
    finished,
    durationSeconds,
    total,
    isResolved,
    isLast,
    correctCount,
    wrongRecords,
    score,
    progressPercent,
    start,
    submit,
    next,
    finish,
    restart,
    retryWrong,
  }
}
