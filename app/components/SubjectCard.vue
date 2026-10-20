<script setup lang="ts">
import type { Subject } from '~/types/quiz'

const props = defineProps<{
  subject: Subject
  best?: number
}>()

const theme = computed(() => subjectThemes[props.subject.theme ?? 'sun'])
const stars = computed(() => starsFor(props.best))
</script>

<template>
  <NuxtLink
    :to="`/quiz/${subject.id}`"
    class="group relative flex items-center gap-4 rounded-[26px] border-[3px] border-ink bg-white p-4 shadow-[0_6px_0_0_var(--color-ink)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--color-ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/50 active:translate-y-[3px] active:shadow-[0_3px_0_0_var(--color-ink)]"
  >
    <span
      aria-hidden="true"
      class="grid size-14 shrink-0 place-items-center rounded-2xl border-[3px] border-ink text-2xl transition group-hover:rotate-[-4deg]"
      :class="theme.solid"
    >
      {{ subject.emoji }}
    </span>

    <span class="min-w-0 flex-1">
      <span class="block truncate text-lg font-extrabold leading-tight">{{ subject.name }}</span>
      <span class="mt-0.5 block text-xs font-bold text-ink-soft">
        {{ subject.questions.length }} soal<span v-if="subject.grade"> · {{ subject.grade }}</span>
      </span>

      <span v-if="best !== undefined" class="mt-2 flex items-center gap-1.5 text-xs font-extrabold" :class="theme.text">
        <span aria-hidden="true">{{ stars > 0 ? '⭐'.repeat(stars) : '☆' }}</span>
        <span>Terbaik {{ best }}%</span>
      </span>
      <span v-else class="mt-2 inline-block text-xs font-extrabold text-ink-soft/60">Belum dicoba</span>
    </span>

    <span
      aria-hidden="true"
      class="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-sm font-black transition group-hover:bg-sun"
    >
      →
    </span>
  </NuxtLink>
</template>
