<script setup lang="ts">
const props = defineProps<{
  label: string
  text: string
  state?: 'idle' | 'correct' | 'wrong' | 'muted'
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [] }>()

const styles = computed(() => {
  switch (props.state) {
    case 'correct':
      return 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-[0_4px_0_0_#047857]'
    case 'wrong':
      return 'border-rose-600 bg-rose-100 text-rose-950 shadow-[0_4px_0_0_#be123c] animate-shake'
    case 'muted':
      return 'border-ink/15 bg-white text-ink-soft/70 opacity-60'
    default:
      return 'border-ink bg-white shadow-[0_4px_0_0_var(--color-ink)] hover:-translate-y-0.5 hover:bg-amber-50'
  }
})

const badgeStyles = computed(() => {
  switch (props.state) {
    case 'correct':
      return 'border-emerald-600 bg-emerald-500 text-white'
    case 'wrong':
      return 'border-rose-600 bg-rose-500 text-white'
    case 'muted':
      return 'border-ink/20 bg-white text-ink-soft/60'
    default:
      return 'border-ink bg-paper text-ink group-hover:bg-sun'
  }
})
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[
      'group flex w-full items-center gap-3 rounded-2xl border-[3px] px-3 py-3.5 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun/60 active:translate-y-[2px] active:shadow-none disabled:cursor-default',
      styles,
    ]"
    @click="emit('select')"
  >
    <span
      aria-hidden="true"
      :class="[
        'grid size-9 shrink-0 place-items-center rounded-xl border-2 text-sm font-black transition',
        badgeStyles,
      ]"
    >
      {{ label }}
    </span>
    <span class="flex-1 text-base font-bold leading-snug">{{ text }}</span>
    <span v-if="state === 'correct'" class="text-lg text-emerald-600" aria-hidden="true">✓</span>
    <span v-else-if="state === 'wrong'" class="text-lg text-rose-600" aria-hidden="true">✕</span>
  </button>
</template>
