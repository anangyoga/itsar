<script setup lang="ts">
useHead({
  title: "Itsar Bentala Akalendra",
  meta: [
    {
      name: "Quiz App untuk belajar Itsar.",
      content: "Web-app untuk berlatih mengerjakan soal ulangan.",
    },
  ],
});
</script>
<template>
  <div
    class="min-h-screen bg-linear-to-br from-yellow-50 to-blue-50 py-16 px-4 flex flex-col items-center"
  >
    <h1 class="text-4xl font-extrabold mb-4 text-gray-800 text-center">
      Kumpulan Latihan Soal
    </h1>
    <p class="text-gray-600 text-lg mb-12 text-center max-w-xl">
      Pilih soal latihan untuk belajar.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
      <NuxtLink
        to="/semester-satu-bahasa-indonesia"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📘 Soal Bahasa Indonesia 1
        </h2>
        <p class="text-gray-600">Huruf Vokal & Konsonan, Bermain & Olahraga</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-bahasa-indonesia-2"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📘 Soal Bahasa Indonesia 2
        </h2>
        <p class="text-gray-600">Sikap Santun, Keluargaku</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-agama-budi-pekerti"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📗 Soal Agama & BP 1
        </h2>
        <p class="text-gray-600">Al-Quran, Rukun Iman, Basmalah & Hamdalah</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-agama-budi-pekerti-2"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📗 Soal Agama & BP 2
        </h2>
        <p class="text-gray-600">Rukun Islam, Nabi dan Rasul</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-tik"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">🖥️ Soal TIK 1</h2>
        <p class="text-gray-600">Berpikir Komputasional</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-tik-2"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">🖥️ Soal TIK 2</h2>
        <p class="text-gray-600">Informasi & Komunikasi</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-bahasa-inggris"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          🗽 Soal Bahasa Inggris 1
        </h2>
        <p class="text-gray-600">School, Animals, and Family</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-bahasa-inggris-2"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          🗽 Soal Bahasa Inggris 2
        </h2>
        <p class="text-gray-600">Body Parts & Activity</p>
      </NuxtLink>

      <NuxtLink
        to="/semester-satu-seni-budaya"
        class="override grid h-full overflow-hidden rounded-lg border border-black bg-white text-black no-underline transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[3px_3px_#000] grid-rows-[auto_1fr] p-4"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          𑗊 Soal Seni Budaya
        </h2>
        <p class="text-gray-600">Bentuk & Bunyi</p>
      </NuxtLink>
    </div>
  </div>
</template>
