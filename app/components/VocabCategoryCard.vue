<script setup lang="ts">
import type { VocabCategory, VocabProgress } from '~/types/vocab'

const props = defineProps<{
  category: VocabCategory
  progress?: VocabProgress
}>()

const theme = computed(() => subjectThemes[props.category.theme ?? 'sun'])
const stars = computed(() => starsFor(props.progress?.best))
const masteredCount = computed(() => {
  const mastered = new Set(props.progress?.mastered ?? [])
  return props.category.words.filter(word => mastered.has(word.id)).length
})
</script>

<template>
  <NuxtLink
    :to="`/vocab/${category.id}`"
    class="group relative flex items-center gap-4 rounded-[26px] border-[3px] border-ink bg-white p-4 shadow-[0_6px_0_0_var(--color-ink)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--color-ink)] focus-visible:ring-4 focus-visible:ring-sun/50 focus-visible:outline-none active:translate-y-[3px] active:shadow-[0_3px_0_0_var(--color-ink)]"
  >
    <span
      aria-hidden="true"
      class="grid size-14 shrink-0 place-items-center rounded-2xl border-[3px] border-ink text-2xl transition group-hover:rotate-[-4deg]"
      :class="theme.solid"
    >
      {{ category.emoji }}
    </span>

    <span class="min-w-0 flex-1">
      <span class="block truncate text-lg leading-tight font-extrabold">{{ category.name }}</span>
      <span class="mt-0.5 block text-xs font-bold text-ink-soft">
        {{ category.words.length }} kata<span v-if="category.nameEn"> · {{ category.nameEn }}</span>
      </span>

      <span
        v-if="progress?.attempts || masteredCount > 0"
        class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-extrabold"
        :class="theme.text"
      >
        <span v-if="progress?.attempts" class="flex items-center gap-1.5">
          <span aria-hidden="true">{{ stars > 0 ? '⭐'.repeat(stars) : '☆' }}</span>
          <span>Terbaik {{ progress.best }}%</span>
        </span>
        <span class="text-ink-soft/70">
          {{ masteredCount }}/{{ category.words.length }} dikuasai
        </span>
      </span>
      <span v-else class="mt-2 inline-block text-xs font-extrabold text-ink-soft/60"
        >Belum dicoba</span
      >
    </span>

    <span
      aria-hidden="true"
      class="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-sm font-black transition group-hover:bg-sun"
    >
      →
    </span>
  </NuxtLink>
</template>
