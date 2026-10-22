<script setup lang="ts">
const props = withDefaults(defineProps<{ pieces?: number }>(), { pieces: 18 })

const confetti = Array.from({ length: props.pieces }, (_, index) => ({
  left: `${(index * 5.7 + 3) % 96}%`,
  delay: `${(index % 6) * 0.16}s`,
  duration: `${2.2 + (index % 4) * 0.35}s`,
  drift: `${((index % 5) - 2) * 34}px`,
  spin: `${360 + (index % 5) * 120}deg`,
  color: ['#FFC233', '#31C07A', '#EC5B3A', '#3D8BFD', '#9B6BFF'][index % 5],
}))
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 -top-4 h-full overflow-visible"
    aria-hidden="true"
  >
    <span
      v-for="(piece, index) in confetti"
      :key="index"
      class="confetti-piece"
      :style="{
        left: piece.left,
        backgroundColor: piece.color,
        '--delay': piece.delay,
        '--dur': piece.duration,
        '--drift': piece.drift,
        '--spin': piece.spin,
      }"
    />
  </div>
</template>
