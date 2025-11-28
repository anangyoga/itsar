<script setup lang="ts">
import { useQuiz } from "~/composables/useQuiz";
import questions from "~/data/semester-satu-tik";
import QuizStarts from "~/components/QuizStarts.vue";
import QuizEnds from "~/components/QuizEnds.vue";

const quiz = useQuiz();

useHead({
  title: "Soal TIK - Berpikir Komputasional",
  meta: [
    {
      name: "Kumpulan soal tentang Berpikir Komputasional",
      content: "Kumpulan soal tentang Berpikir Komputasional",
    },
  ],
});
</script>

<template>
  <div class="max-w-xl mx-auto p-6 min-h-screen flex flex-col">
    <div
      class="override bg-white border border-black rounded-xl shadow-[4px_4px_#000] p-6 w-full flex-1"
    >
      <QuizStarts
        v-if="!quiz.state.started"
        :title="'Soal TIK 1'"
        :questions="questions"
        :quiz="quiz"
      />

      <QuizQuestions
        v-else-if="quiz.state.started && !quiz.state.finished"
        :quiz="quiz"
      />

      <QuizEnds
        v-else
        :score="quiz.state.score"
        :questions="quiz.state.questions"
        :quiz="quiz"
      />
    </div>
  </div>
</template>
