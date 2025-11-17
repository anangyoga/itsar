<script setup>
import { useQuiz } from "~/composables/useQuiz";
import questions from "~/data/soal-bahasa-inggris";
import confetti from "canvas-confetti";
import { watch } from "vue";

const quiz = useQuiz();

watch(
  () => quiz.state.finished,
  (finished) => {
    if (finished) {
      // delay sedikit biar UI render dulu
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

const start = () => {
  quiz.startQuiz(questions);
  quiz.startTimer();
};

const onSelect = (i) => {
  quiz.pickAnswer(i);

  // delay biar jawaban hijau/merah terlihat dulu
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

const scoreColor = computed(() => {
  const score = quiz.getScorePercentage();

  if (score < 50) return "bg-red-200 border-red-500 text-red-900";
  if (score < 70) return "bg-yellow-200 border-yellow-500 text-yellow-900";
  return "bg-green-200 border-green-500 text-green-900";
});

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
</script>

<template>
  <div class="max-w-xl mx-auto p-6 min-h-screen flex flex-col">
    <div
      class="override bg-white border border-black rounded-xl shadow-[4px_4px_#000] p-6 w-full flex-1"
    >
      <!-- =================== -->
      <!-- STATE: BELUM MULAI -->
      <!-- =================== -->
      <div
        v-if="!quiz.state.started"
        class="flex flex-col items-center text-center py-10 space-y-6"
      >
        <!-- Big Emoji -->
        <div class="text-6xl">📗</div>

        <!-- Title -->
        <h1 class="text-4xl font-extrabold tracking-tight">
          Soal Bahasa Inggris
        </h1>

        <!-- Card -->
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

        <!-- Footer text -->
        <p class="text-gray-600 text-sm">Jawab sebaik mungkin ya! 🤓</p>
      </div>

      <!-- =================== -->
      <!-- STATE: SUDAH MULAI -->
      <!-- =================== -->
      <div
        v-else-if="quiz.state.started && !quiz.state.finished"
        class="space-y-4"
      >
        <!-- Timer + Progress -->
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

          <!-- Progress bar -->
          <div
            class="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-black"
          >
            <div
              class="h-full bg-black transition-all duration-300"
              :style="{
                width:
                  ((quiz.state.currentIndex + 1) /
                    quiz.state.questions.length) *
                    100 +
                  '%',
              }"
            ></div>
          </div>
        </div>

        <!-- Pertanyaan -->
        <div
          class="p-4 rounded-lg border border-black bg-white shadow-[5px_5px_#C4C4C4]"
        >
          <p class="text-lg font-semibold">
            {{ quiz.state.questions[quiz.state.currentIndex].question }}
          </p>

          <img
            v-if="quiz.state.questions[quiz.state.currentIndex].image"
            :src="quiz.state.questions[quiz.state.currentIndex].image"
            class="w-40 mx-auto my-4 border border-black rounded-lg"
          />
        </div>

        <!-- Pilihan Jawaban -->
        <div
          v-for="(choice, i) in quiz.state.questions[quiz.state.currentIndex]
            .choices"
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

      <!-- =================== -->
      <!-- STATE: SELESAI -->
      <!-- =================== -->
      <div v-else class="flex flex-col items-center space-y-6 py-10">
        <!-- Title -->
        <h2 class="text-3xl font-extrabold text-black">🎉 Selesai!</h2>

        <!-- Score Box -->
        <div
          class="override rounded-lg border border-black bg-white p-6 shadow-[4px_4px_#000] w-full max-w-sm text-center space-y-2"
        >
          <p class="text-lg font-semibold text-gray-700">
            Skor Benar:
            <span class="font-bold text-black">{{ quiz.state.score }}</span>
            /
            {{ quiz.state.questions.length }}
          </p>

          <p class="text-2xl font-extrabold" :class="scoreColor">
            Nilai: {{ quiz.getScorePercentage() }}
          </p>
        </div>

        <!-- Motivational Message -->
        <div
          class="rounded-lg border border-black bg-white p-5 shadow-[4px_4px_#000] w-full max-w-sm text-center"
        >
          <p class="text-xl font-bold">
            {{ getMotivationMessage() }}
          </p>
        </div>

        <!-- Home Button -->
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-black text-white rounded-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_#000] transition-all"
        >
          Kembali ke Halaman Utama
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
