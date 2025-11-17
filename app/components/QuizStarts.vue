<script setup lang="ts">
import type { Quiz } from "~/types/scheme";

const { title, questions, quiz } = defineProps<{
  title: string;
  questions: {
    question: string;
    choices: string[];
    answer: number;
    image?: string | undefined;
  }[];
  quiz: ReturnType<typeof useQuiz>;
}>();

const start = () => {
  quiz.startQuiz(questions as Quiz[]);
  quiz.startTimer();
};
</script>
<template>
  <div class="flex flex-col items-center text-center py-10 space-y-6">
    <h1 class="text-4xl font-extrabold tracking-tight">{{ title }}</h1>

    <div
      class="override border border-black bg-white shadow-[4px_4px_#000] rounded-xl p-6 w-full max-w-md"
    >
      <p class="text-lg mb-4">
        Siap mengasah otakmu? 🧠
        <br />Ada <span class="font-bold">{{ questions.length }}</span> soal
        menunggu kamu!
      </p>

      <button
        @click="start"
        class="w-full cursor-pointer px-6 py-3 bg-black text-white rounded-lg font-semibold text-lg hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#C4C4C4] transition-all duration-200"
      >
        🚀 Mulai Soal
      </button>
    </div>

    <p class="text-gray-600 text-sm">Jawab sebaik mungkin ya! 🤓</p>
  </div>
</template>
