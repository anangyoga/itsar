<script setup lang="ts">
const { muted, toggle } = useSound()
</script>

<template>
  <button
    type="button"
    class="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white text-lg shadow-[0_3px_0_0_var(--color-ink)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/60 active:translate-y-[2px] active:shadow-none"
    :aria-pressed="!muted"
    :aria-label="muted ? 'Nyalakan suara' : 'Matikan suara'"
    :title="muted ? 'Nyalakan suara' : 'Matikan suara'"
    @click="toggle"
  >
    <span aria-hidden="true">{{ muted ? '🔇' : '🔊' }}</span>
  </button>
</template>
