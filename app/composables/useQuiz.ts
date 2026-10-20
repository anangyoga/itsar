import type { Question, QuizQuestion, Subject } from '~/types/quiz'

export interface AnswerRecord {
  question: QuizQuestion
  picked: number
}

export function useQuiz(subject: Ref<Subject | undefined>) {
  const { record } = useProgress()
  const sound = useSound()

  const questions = ref<QuizQuestion[]>([])
  const current = ref(0)
  const picked = ref<number | null>(null)
  const records = ref<AnswerRecord[]>([])
  const finished = ref(false)
  const startedAt = ref(0)
  const durationSeconds = ref(0)
  const fullRound = ref(true)

  const total = computed(() => questions.value.length)
  const question = computed<QuizQuestion | undefined>(() => questions.value[current.value])
  const isAnswered = computed(() => picked.value !== null)
  const isLast = computed(() => current.value >= total.value - 1)
  const isCorrect = computed(
    () => picked.value !== null && picked.value === question.value?.answer,
  )
  const correctCount = computed(
    () => records.value.filter(item => item.picked === item.question.answer).length,
  )
  const wrongRecords = computed(
    () => records.value.filter(item => item.picked !== item.question.answer),
  )
  const score = computed(() =>
    total.value === 0 ? 0 : Math.round((correctCount.value / total.value) * 100),
  )
  const progressPercent = computed(() =>
    total.value === 0 ? 0 : ((current.value + 1) / total.value) * 100,
  )

  function start(source?: Question[], options: { fullRound?: boolean } = {}) {
    const pool = source ?? subject.value?.questions ?? []
    questions.value = shuffle(pool).map((item) => {
      const order = shuffle(item.options.map((_, index) => index))
      return {
        ...item,
        options: order.map(index => item.options[index]!),
        answer: order.indexOf(item.answer),
      }
    })

    current.value = 0
    picked.value = null
    records.value = []
    finished.value = false
    durationSeconds.value = 0
    startedAt.value = Date.now()
    fullRound.value = options.fullRound ?? true
  }

  function select(optionIndex: number) {
    const active = question.value
    if (!active || finished.value || picked.value !== null) return
    if (optionIndex < 0 || optionIndex >= active.options.length) return

    picked.value = optionIndex
    records.value.push({ question: active, picked: optionIndex })

    if (optionIndex === active.answer) sound.playCorrect()
    else sound.playWrong()
  }

  function next() {
    if (!isAnswered.value) return
    if (isLast.value) {
      finish()
      return
    }
    current.value += 1
    picked.value = null
  }

  function finish() {
    if (finished.value) return
    finished.value = true
    durationSeconds.value = Math.round((Date.now() - startedAt.value) / 1000)
    sound.playFinish()

    // Only full rounds count towards the saved best score.
    if (subject.value && fullRound.value) record(subject.value.id, score.value)
  }

  function restart() {
    start()
  }

  function retryWrong() {
    const missed = wrongRecords.value.map(item => item.question)
    if (!missed.length) return
    start(missed, { fullRound: false })
  }

  return {
    questions,
    current,
    picked,
    records,
    finished,
    durationSeconds,
    total,
    question,
    isAnswered,
    isLast,
    isCorrect,
    correctCount,
    wrongRecords,
    score,
    progressPercent,
    start,
    select,
    next,
    finish,
    restart,
    retryWrong,
  }
}
