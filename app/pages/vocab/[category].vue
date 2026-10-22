<script setup lang="ts">
const route = useRoute()
const { getCategory } = useVocab()
const { load: loadProgress } = useVocabProgress()
const sound = useSound()

const categoryId = computed(() => String(route.params.category ?? ''))
const category = computed(() => getCategory(categoryId.value))
const theme = computed(() => subjectThemes[category.value?.theme ?? 'sun'])

const {
  current,
  word,
  typed,
  status,
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
  restart,
  retryWrong,
} = useSpellingQuiz(category)

const inputRef = ref<HTMLInputElement | null>(null)
const nextRef = ref<HTMLButtonElement | null>(null)

const isNear = computed(() => status.value === 'near')
const isCorrect = computed(() => status.value === 'correct')
const isWrong = computed(() => status.value === 'wrong')
const submitLabel = computed(() => (isNear.value ? 'Coba lagi' : 'Periksa'))

const inputClasses = computed(() => {
  switch (status.value) {
    case 'near':
      return 'border-amber-500 bg-amber-50'
    case 'correct':
      return 'border-emerald-600 bg-emerald-50 text-emerald-900'
    case 'wrong':
      return 'border-rose-600 bg-rose-50 text-rose-900'
    default:
      return 'border-ink bg-white'
  }
})

function focusInput() {
  if (!import.meta.client) return
  nextTick(() => inputRef.value?.focus())
}

function onSubmit() {
  const result = submit(typed.value)
  if (!result) return

  if (result === 'near') {
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
    return
  }

  nextTick(() => nextRef.value?.focus())
}

function onNext() {
  next()
  focusInput()
}

function onKeydown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
  if (event.key !== 'Enter' || finished.value || !isResolved.value) return

  // Buttons and links already handle Enter themselves.
  const target = event.target
  if (target instanceof HTMLElement && target.closest('button, a')) return

  event.preventDefault()
  onNext()
}

onMounted(() => {
  loadProgress()
  sound.restore()
  if (category.value) start()
  focusInput()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch([current, finished], () => {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(current, focusInput)

watch(category, next => {
  if (!next) return
  start()
  focusInput()
})

useHead(() => ({
  title: category.value
    ? `${category.value.name} — Latihan Menulis`
    : 'Latihan Menulis — Belajar Bareng',
}))
</script>

<template>
  <div class="bg-dots min-h-dvh bg-cream">
    <div class="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pt-5 pb-10 sm:px-8">
      <header class="flex items-center gap-3">
        <NuxtLink
          to="/vocab"
          aria-label="Kembali ke daftar kategori"
          class="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white text-lg shadow-[0_3px_0_0_var(--color-ink)] transition focus-visible:ring-4 focus-visible:ring-sun/60 focus-visible:outline-none active:translate-y-[2px] active:shadow-none"
        >
          <span aria-hidden="true">←</span>
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <p class="truncate text-[11px] font-extrabold tracking-[0.14em] text-ink-soft uppercase">
            Latihan menulis
          </p>
          <p class="truncate text-sm font-bold">
            {{ category ? `${category.name} · ${category.words.length} kata` : 'Latihan menulis' }}
          </p>
        </div>

        <SoundToggle />
      </header>

      <main v-if="!category" class="mt-20 text-center">
        <p class="text-5xl" aria-hidden="true">🧐</p>
        <h1 class="mt-4 text-2xl font-black">Kategori tidak ditemukan</h1>
        <p class="mx-auto mt-2 max-w-xs text-sm leading-relaxed font-semibold text-ink-soft">
          Mungkin namanya berubah atau daftar katanya sedang dirapikan. Yuk pilih kategori lain.
        </p>
        <NuxtLink
          to="/vocab"
          class="mt-6 inline-block rounded-2xl border-[3px] border-ink bg-sun px-5 py-3 text-sm font-extrabold shadow-[0_4px_0_0_var(--color-ink)] transition active:translate-y-[2px] active:shadow-none"
        >
          Kembali ke kategori
        </NuxtLink>
      </main>

      <VocabResult
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

      <template v-else-if="word">
        <QuizProgress
          :current="current"
          :total="total"
          :correct="correctCount"
          :percent="progressPercent"
        />

        <Transition name="q" mode="out-in">
          <section :key="current" class="mt-4">
            <div
              class="rounded-[28px] border-[3px] border-ink bg-paper p-5 shadow-[0_6px_0_0_var(--color-ink)] sm:p-7"
            >
              <p class="text-[11px] font-extrabold tracking-[0.16em] text-ink-soft uppercase">
                Tulis dalam bahasa Inggris
              </p>
              <h1 class="mt-3 text-2xl leading-snug font-extrabold text-balance sm:text-3xl">
                Apa bahasa Inggris dari
                <span :class="theme.text">“{{ word.prompt }}”</span>?
              </h1>
            </div>

            <form class="mt-4" @submit.prevent="onSubmit">
              <label
                for="spelling-answer"
                class="block text-xs font-extrabold tracking-[0.14em] text-ink-soft uppercase"
              >
                Jawabanmu
              </label>

              <div class="mt-2 flex flex-col gap-2.5 sm:flex-row">
                <input
                  id="spelling-answer"
                  ref="inputRef"
                  v-model="typed"
                  type="text"
                  inputmode="text"
                  enterkeyhint="go"
                  autocomplete="off"
                  autocapitalize="off"
                  autocorrect="off"
                  spellcheck="false"
                  maxlength="40"
                  placeholder="Tulis di sini…"
                  :disabled="isResolved"
                  :aria-invalid="isWrong"
                  :class="[
                    'min-w-0 flex-1 rounded-2xl border-[3px] px-4 py-3.5 text-center text-2xl font-extrabold shadow-[0_4px_0_0_var(--color-ink)] transition outline-none placeholder:text-lg placeholder:font-bold placeholder:text-ink-soft/40 focus-visible:ring-4 focus-visible:ring-sun/50 disabled:opacity-100',
                    inputClasses,
                  ]"
                />

                <button
                  type="submit"
                  :disabled="isResolved || !typed.trim()"
                  class="shrink-0 cursor-pointer rounded-2xl border-[3px] border-ink bg-sun px-6 py-3.5 text-base font-extrabold shadow-[0_4px_0_0_var(--color-ink)] transition focus-visible:ring-4 focus-visible:ring-sun/50 focus-visible:outline-none active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_var(--color-ink)]"
                >
                  {{ submitLabel }}
                </button>
              </div>
            </form>

            <Transition name="rise">
              <p
                v-if="isNear"
                class="mt-3 rounded-2xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800"
                aria-live="polite"
              >
                🤔 Hampir benar! Coba periksa ejaannya sekali lagi. Kamu masih punya satu
                kesempatan.
              </p>
            </Transition>
          </section>
        </Transition>

        <Transition name="rise">
          <div
            v-if="isResolved"
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
                <p
                  class="text-base font-extrabold"
                  :class="isCorrect ? 'text-emerald-800' : 'text-rose-800'"
                >
                  {{ isCorrect ? 'Tepat sekali!' : 'Belum tepat' }}
                </p>
                <p v-if="isWrong" class="mt-1 text-sm font-bold">
                  Jawaban benar:
                  <span class="text-emerald-700">{{ word.answer }}</span>
                </p>
                <p
                  v-if="word.example"
                  class="mt-1.5 text-sm leading-relaxed font-semibold text-ink-soft"
                >
                  {{ word.example }}
                </p>
              </div>
            </div>

            <button
              ref="nextRef"
              type="button"
              class="mt-4 w-full cursor-pointer rounded-2xl border-[3px] border-ink px-5 py-3 text-base font-extrabold shadow-[0_4px_0_0_var(--color-ink)] transition focus-visible:ring-4 focus-visible:ring-sun/50 focus-visible:outline-none active:translate-y-[2px] active:shadow-none"
              :class="isCorrect ? 'bg-sun' : 'bg-white'"
              @click="onNext"
            >
              {{ isLast ? 'Lihat hasil 🎉' : 'Lanjut →' }}
            </button>
          </div>
        </Transition>

        <p class="mt-5 hidden text-center text-[11px] font-semibold text-ink-soft/70 sm:block">
          Tekan
          <kbd class="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-sans font-bold"
            >Enter</kbd
          >
          untuk memeriksa, lalu
          <kbd class="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-sans font-bold"
            >Enter</kbd
          >
          lagi untuk lanjut.
        </p>
      </template>

      <div v-else class="mt-5" aria-hidden="true">
        <div class="h-3.5 w-full animate-pulse rounded-full border-2 border-ink/15 bg-white/70" />
        <div class="mt-4 rounded-[28px] border-[3px] border-ink/15 bg-paper p-6">
          <div class="h-5 w-2/3 animate-pulse rounded-full bg-ink/10" />
          <div class="mt-3 h-5 w-1/2 animate-pulse rounded-full bg-ink/10" />
        </div>
        <div class="mt-4 h-16 animate-pulse rounded-2xl border-2 border-ink/10 bg-white/70" />
      </div>
    </div>
  </div>
</template>
