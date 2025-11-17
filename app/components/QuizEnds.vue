<script setup lang="ts">
import confetti from "canvas-confetti";

const { score, questions, quiz } = defineProps<{
  score: number;
  questions: {
    question: string;
    choices: string[];
    answer: number;
    image?: string;
  }[];
  quiz: ReturnType<typeof useQuiz>;
}>();

const getMotivationMessage = () => {
  const score = quiz.getScorePercentage();

  if (score >= 90) {
    return "🔥 Hebat! Kamu dapat " + score + "!";
  }

  if (score >= 70) {
    return "😊 Kamu sudah bagus, ayo coba lagi!";
  }

  return "🌱 Belum sempurna, tapi kamu sedang belajar. Semangat!";
};

const scoreColor = computed(() => {
  const score = quiz.getScorePercentage();

  if (score < 50) return "bg-red-200 border-red-500 text-red-900";
  if (score < 70) return "bg-yellow-200 border-yellow-500 text-yellow-900";
  return "bg-green-200 border-green-500 text-green-900";
});

watch(
  () => quiz.state.finished,
  (finished) => {
    if (finished) {
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 300);
    }
  }
);
</script>

<template>
  <div class="flex flex-col items-center space-y-6 py-10">
    <h2 class="text-3xl font-extrabold text-black">🎉 Selesai!</h2>

    <div
      class="override rounded-lg border border-black bg-white p-6 shadow-[4px_4px_#000] w-full max-w-sm text-center space-y-2"
    >
      <p class="text-lg font-semibold text-gray-700">
        Skor Benar:
        <span class="font-bold text-black">{{ score }}</span>
        /
        {{ questions.length }}
      </p>

      <p class="text-2xl font-extrabold" :class="scoreColor">
        Nilai: {{ quiz.getScorePercentage() }}
      </p>
    </div>

    <div
      class="rounded-lg border border-black bg-white p-5 shadow-[4px_4px_#000] w-full max-w-sm text-center"
    >
      <p class="text-xl font-bold">
        {{ getMotivationMessage() }}
      </p>
    </div>

    <NuxtLink
      to="/"
      class="inline-block px-6 py-3 bg-black text-white rounded-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_#000] transition-all"
    >
      Kembali ke Halaman Utama
    </NuxtLink>
  </div>
</template>
