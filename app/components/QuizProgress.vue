<script setup lang="ts">
defineProps<{
  current: number
  total: number
  correct: number
  percent: number
}>()
</script>

<template>
  <div class="mt-5">
    <div class="flex items-end justify-between gap-3">
      <p class="text-sm font-extrabold">
        Soal {{ current + 1 }}
        <span class="font-bold text-ink-soft">dari {{ total }}</span>
      </p>
      <p
        class="flex items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 py-1 text-xs font-extrabold text-ink-soft"
      >
        <span aria-hidden="true">⭐</span>
        {{ correct }} benar
      </p>
    </div>

    <div
      class="mt-2 h-3.5 overflow-hidden rounded-full border-2 border-ink bg-white"
      role="progressbar"
      :aria-valuenow="current + 1"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="`Soal ${current + 1} dari ${total}`"
    >
      <div
        class="h-full rounded-full bg-sun transition-all duration-500 ease-out"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
