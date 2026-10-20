<script setup lang="ts">
const route = useRoute()
const { getSubject } = useSubjects()
const { load: loadProgress } = useProgress()
const sound = useSound()

const subjectId = computed(() => String(route.params.subject ?? ''))
const subject = computed(() => getSubject(subjectId.value))

const {
  current,
  question,
  picked,
  finished,
  durationSeconds,
  total,
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
  restart,
  retryWrong,
} = useQuiz(subject)

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

function answerState(index: number): 'idle' | 'correct' | 'wrong' | 'muted' {
  if (!isAnswered.value) return 'idle'
  if (index === question.value?.answer) return 'correct'
  if (index === picked.value) return 'wrong'
  return 'muted'
}

function onKeydown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
  if (finished.value || !question.value) return

  if (/^[1-9]$/.test(event.key)) {
    const index = Number(event.key) - 1
    if (index < question.value.options.length) {
      event.preventDefault()
      select(index)
    }
    return
  }

  if (event.key === 'Enter' && isAnswered.value) {
    event.preventDefault()
    next()
  }
}

onMounted(() => {
  loadProgress()
  sound.restore()
  if (subject.value) start()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch([current, finished], () => {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
})

useHead(() => ({
  title: subject.value ? `${subject.value.name} — Belajar Bareng` : 'Kuis — Belajar Bareng',
}))
</script>

<template>
  <div class="min-h-dvh bg-cream bg-dots">
    <div class="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-10 pt-5 sm:px-8">
      <header class="flex items-center gap-3">
        <NuxtLink
          to="/"
          aria-label="Kembali ke daftar pelajaran"
          class="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white text-lg shadow-[0_3px_0_0_var(--color-ink)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/60 active:translate-y-[2px] active:shadow-none"
        >
          <span aria-hidden="true">←</span>
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <p class="truncate text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
            {{ subject?.name ?? 'Kuis' }}
          </p>
          <p class="truncate text-sm font-bold">
            {{ subject?.grade ?? 'Belajar bareng' }}
          </p>
        </div>

        <SoundToggle />
      </header>

      <main v-if="!subject" class="mt-20 text-center">
        <p class="text-5xl" aria-hidden="true">🧐</p>
        <h1 class="mt-4 text-2xl font-black">Mata pelajaran tidak ditemukan</h1>
        <p class="mx-auto mt-2 max-w-xs text-sm font-semibold leading-relaxed text-ink-soft">
          Mungkin namanya berubah atau soalnya sedang dirapikan. Yuk pilih dari daftar.
        </p>
        <NuxtLink
          to="/"
          class="mt-6 inline-block rounded-2xl border-[3px] border-ink bg-sun px-5 py-3 text-sm font-extrabold shadow-[0_4px_0_0_var(--color-ink)] transition active:translate-y-[2px] active:shadow-none"
        >
          Kembali ke beranda
        </NuxtLink>
      </main>

      <QuizResult
        v-else-if="finished"
        class="mt-6"
        :score="score"
        :correct="correctCount"
        :total="total"
        :duration="durationSeconds"
        :wrong="wrongRecords"
        @restart="restart"
        @retry-wrong="retryWrong"
      />

      <template v-else-if="question">
        <QuizProgress
          :current="current"
          :total="total"
          :correct="correctCount"
          :percent="progressPercent"
        />

        <Transition name="q" mode="out-in">
          <section :key="current" class="mt-4">
            <div class="rounded-[28px] border-[3px] border-ink bg-paper p-5 shadow-[0_6px_0_0_var(--color-ink)] sm:p-7">
              <blockquote
                v-if="question.passage"
                class="mb-4 rounded-2xl border-2 border-dashed border-ink/25 bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-ink-soft"
              >
                {{ question.passage }}
              </blockquote>
              <h1 class="text-balance text-xl font-extrabold leading-snug sm:text-2xl">
                {{ question.question }}
              </h1>
            </div>

            <div class="mt-4 grid gap-2.5" role="group" aria-label="Pilihan jawaban">
              <AnswerButton
                v-for="(option, index) in question.options"
                :key="`${current}-${index}`"
                :label="letters[index] ?? String(index + 1)"
                :text="option"
                :state="answerState(index)"
                :disabled="isAnswered"
                @select="select(index)"
              />
            </div>
          </section>
        </Transition>

        <Transition name="rise">
          <div
            v-if="isAnswered"
            class="mt-4 rounded-3xl border-[3px] p-4 sm:p-5"
            :class="isCorrect ? 'border-emerald-600 bg-emerald-50' : 'border-rose-500 bg-rose-50'"
            aria-live="polite"
          >
            <div class="flex items-start gap-3">
              <span
                class="grid size-8 shrink-0 place-items-center rounded-full text-base font-black text-white"
                :class="isCorrect ? 'bg-emerald-500' : 'bg-rose-500'"
                aria-hidden="true"
              >
                {{ isCorrect ? '✓' : '✕' }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-base font-extrabold" :class="isCorrect ? 'text-emerald-800' : 'text-rose-800'">
                  {{ isCorrect ? 'Tepat sekali!' : 'Belum tepat' }}
                </p>
                <p v-if="!isCorrect" class="mt-1 text-sm font-bold">
                  Jawaban benar:
                  <span class="text-emerald-700">{{ question.options[question.answer] }}</span>
                </p>
                <p v-if="question.explanation" class="mt-1.5 text-sm font-semibold leading-relaxed text-ink-soft">
                  {{ question.explanation }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="mt-4 w-full rounded-2xl border-[3px] border-ink px-5 py-3 text-base font-extrabold shadow-[0_4px_0_0_var(--color-ink)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/50 active:translate-y-[2px] active:shadow-none"
              :class="isCorrect ? 'bg-sun' : 'bg-white'"
              @click="next"
            >
              {{ isLast ? 'Lihat hasil 🎉' : 'Lanjut →' }}
            </button>
          </div>
        </Transition>

        <p class="mt-5 hidden text-center text-[11px] font-semibold text-ink-soft/70 sm:block">
          Tekan <kbd class="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-sans font-bold">1</kbd>–<kbd class="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-sans font-bold">4</kbd> untuk memilih, lalu <kbd class="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-sans font-bold">Enter</kbd> untuk lanjut.
        </p>
      </template>

      <div v-else class="mt-5" aria-hidden="true">
        <div class="h-3.5 w-full animate-pulse rounded-full border-2 border-ink/15 bg-white/70" />
        <div class="mt-4 rounded-[28px] border-[3px] border-ink/15 bg-paper p-6">
          <div class="h-5 w-2/3 animate-pulse rounded-full bg-ink/10" />
          <div class="mt-3 h-5 w-1/2 animate-pulse rounded-full bg-ink/10" />
        </div>
        <div class="mt-4 grid gap-2.5">
          <div v-for="index in 4" :key="index" class="h-16 animate-pulse rounded-2xl border-2 border-ink/10 bg-white/70" />
        </div>
      </div>
    </div>
  </div>
</template>
