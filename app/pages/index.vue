<template>
  <div
    class="min-h-screen bg-linear-to-br from-yellow-50 to-blue-50 py-16 px-4 flex flex-col items-center"
  >
    <h1 class="text-4xl font-extrabold mb-4 text-gray-800 text-center">
      Bank Soal Anak
    </h1>
    <p class="text-gray-600 text-lg mb-12 text-center max-w-xl">
      Pilih topik kuis yang ingin kamu kerjakan. Semua soal dibuat sederhana dan
      menyenangkan!
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
      <!-- Card: Matematika -->
      <NuxtLink
        to="/soal-matematika"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📘 Soal Matematika
        </h2>
        <p class="text-gray-600">
          30 soal hitungan dasar. Cocok untuk pemanasan otak!
        </p>
      </NuxtLink>

      <!-- Card: Bahasa Inggris -->
      <NuxtLink
        to="/soal-bahasa-inggris"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📗 Soal Bahasa Inggris
        </h2>
        <p class="text-gray-600">
          Vocabulary & grammar dasar dengan gaya kuis seru!
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
