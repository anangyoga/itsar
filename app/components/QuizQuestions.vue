<script setup lang="ts">
const { quiz } = defineProps<{
  quiz: ReturnType<typeof useQuiz>;
}>();

const currentQuestion = computed(
  () => quiz.state.questions?.[quiz.state.currentIndex] ?? null
);

const onSelect = (i: number) => {
  if (!currentQuestion.value) return;
  quiz.pickAnswer(i);

  setTimeout(() => {
    quiz.nextQuestion();
  }, 2000);
};

const formattedTime = computed(() => {
  const total = quiz.state.timeLeft;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return `${minutes} menit ${seconds} detik`;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <p class="text-sm font-semibold text-gray-600">
          Waktu: {{ formattedTime }}
        </p>

        <p class="text-sm font-semibold text-gray-600">
          Soal: {{ quiz.state.currentIndex + 1 }} /
          {{ quiz.state.questions.length }}
        </p>
      </div>

      <div
        class="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-black"
      >
        <div
          class="h-full bg-black transition-all duration-300"
          :style="{
            width:
              ((quiz.state.currentIndex + 1) / quiz.state.questions.length) *
                100 +
              '%',
          }"
        ></div>
      </div>
    </div>

    <div
      class="p-4 rounded-lg border border-black bg-white shadow-[5px_5px_#C4C4C4]"
    >
      <p class="text-lg font-semibold">
        {{ currentQuestion?.question }}
      </p>

      <img
        v-if="currentQuestion?.image"
        :src="currentQuestion?.image"
        class="w-40 mx-auto my-4 border border-black rounded-lg"
      />
    </div>

    <div
      v-for="(choice, i) in currentQuestion?.choices || []"
      :key="i"
      @click="onSelect(i)"
      class="p-4 rounded-lg border border-black cursor-pointer transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[2px_2px_#000]"
      :class="[
        quiz.state.selectedIndex === i && quiz.state.isCorrect === true
          ? 'bg-green-200'
          : '',
        quiz.state.selectedIndex === i && quiz.state.isCorrect === false
          ? 'bg-red-200'
          : '',
      ]"
    >
      {{ choice }}
    </div>
  </div>
</template>
