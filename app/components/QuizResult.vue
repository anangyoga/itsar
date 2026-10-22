<script setup lang="ts">
import type { AnswerRecord } from '~/composables/useQuiz'

const props = defineProps<{
  score: number
  correct: number
  total: number
  duration: number
  wrong: AnswerRecord[]
}>()

const emit = defineEmits<{ restart: []; retryWrong: [] }>()

const stars = computed(() => starsFor(props.score))
const message = computed(() => scoreMessage(props.score))
</script>

<template>
  <section class="animate-pop relative" role="status" aria-live="polite">
    <StarConfetti v-if="stars === 3" />

    <div
      class="rounded-[28px] border-[3px] border-ink bg-paper p-6 text-center shadow-[0_6px_0_0_var(--color-ink)] sm:p-8"
    >
      <p class="text-xs font-extrabold tracking-[0.18em] text-ink-soft uppercase">Hasil kuis</p>

      <div class="mt-5 flex justify-center">
        <div
          class="grid size-36 place-items-center rounded-full border-[3px] border-ink p-2"
          :style="{
            background: `conic-gradient(var(--color-grass) ${score * 3.6}deg, #fffdf8 ${score * 3.6}deg)`,
          }"
        >
          <div
            class="grid size-full place-items-center rounded-full border-[3px] border-ink bg-paper"
          >
            <div>
              <p class="text-4xl leading-none font-black">
                {{ score }}<span class="text-2xl">%</span>
              </p>
              <p class="mt-1 text-xs font-bold text-ink-soft">{{ correct }}/{{ total }} benar</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex justify-center gap-1.5" :aria-label="`${stars} dari 3 bintang`">
        <span
          v-for="index in 3"
          :key="index"
          class="text-3xl transition"
          :class="
            index <= stars ? 'drop-shadow-[0_2px_0_rgba(47,36,24,0.25)]' : 'opacity-25 grayscale'
          "
          :style="{ animationDelay: `${index * 0.12}s` }"
          aria-hidden="true"
        >
          ⭐
        </span>
      </div>

      <h2 class="mt-3 text-2xl font-black">{{ message.title }}</h2>
      <p class="mt-1 text-sm font-semibold text-ink-soft">{{ message.subtitle }}</p>

      <dl class="mt-6 grid grid-cols-3 gap-2">
        <div class="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-2 py-3">
          <dt class="text-[11px] font-extrabold tracking-wide text-emerald-700 uppercase">Benar</dt>
          <dd class="text-xl font-black text-emerald-800">{{ correct }}</dd>
        </div>
        <div class="rounded-2xl border-2 border-rose-200 bg-rose-50 px-2 py-3">
          <dt class="text-[11px] font-extrabold tracking-wide text-rose-600 uppercase">Salah</dt>
          <dd class="text-xl font-black text-rose-700">{{ total - correct }}</dd>
        </div>
        <div class="rounded-2xl border-2 border-amber-200 bg-amber-50 px-2 py-3">
          <dt class="text-[11px] font-extrabold tracking-wide text-amber-700 uppercase">Waktu</dt>
          <dd class="text-xl font-black text-amber-800">{{ formatDuration(duration) }}</dd>
        </div>
      </dl>

      <details
        v-if="wrong.length"
        class="mt-5 rounded-2xl border-2 border-dashed border-ink/25 bg-white/60 text-left"
      >
        <summary
          class="cursor-pointer list-none px-4 py-3 text-sm font-extrabold text-ink-soft marker:hidden"
        >
          Lihat {{ wrong.length }} soal yang belum tepat
          <span class="float-right text-ink/40" aria-hidden="true">▾</span>
        </summary>
        <ul class="divide-y-2 divide-dashed divide-ink/10 border-t-2 border-dashed border-ink/20">
          <li v-for="(item, index) in wrong" :key="index" class="px-4 py-3">
            <p class="text-sm leading-snug font-bold">{{ item.question.question }}</p>
            <p class="mt-1.5 text-xs font-semibold text-rose-600">
              Jawabanmu: {{ item.question.options[item.picked] }}
            </p>
            <p class="text-xs font-semibold text-emerald-700">
              Jawaban benar: {{ item.question.options[item.question.answer] }}
            </p>
            <p
              v-if="item.question.explanation"
              class="mt-1 text-xs leading-relaxed font-medium text-ink-soft"
            >
              {{ item.question.explanation }}
            </p>
          </li>
        </ul>
      </details>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <button
        v-if="wrong.length"
        type="button"
        class="rounded-2xl border-[3px] border-ink bg-grass px-5 py-3.5 text-base font-extrabold text-white shadow-[0_5px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-grass/40 focus-visible:outline-none active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-ink)]"
        @click="emit('retryWrong')"
      >
        Latih soal yang salah
      </button>

      <button
        type="button"
        class="rounded-2xl border-[3px] border-ink bg-sun px-5 py-3.5 text-base font-extrabold shadow-[0_5px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-sun/50 focus-visible:outline-none active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-ink)]"
        :class="wrong.length ? '' : 'sm:col-span-2'"
        @click="emit('restart')"
      >
        Ulangi kuis
      </button>

      <NuxtLink
        to="/"
        class="rounded-2xl border-2 border-ink/15 bg-white/70 px-5 py-3 text-center text-sm font-extrabold text-ink-soft transition hover:bg-white focus-visible:ring-4 focus-visible:ring-sun/40 focus-visible:outline-none sm:col-span-2"
      >
        ← Ganti mata pelajaran
      </NuxtLink>
    </div>
  </section>
</template>
