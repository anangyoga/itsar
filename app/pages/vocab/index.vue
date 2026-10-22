<script setup lang="ts">
const { categories } = useVocab()
const { progress, load } = useVocabProgress()

const totalWords = computed(() =>
  categories.reduce((sum, category) => sum + category.words.length, 0),
)
const totalMastered = computed(() =>
  categories.reduce((sum, category) => {
    const mastered = new Set(progress.value[category.id]?.mastered ?? [])
    return sum + category.words.filter(word => mastered.has(word.id)).length
  }, 0),
)

onMounted(() => {
  load()
})

useHead({ title: 'Latihan Menulis — Belajar Bareng' })
</script>

<template>
  <div class="bg-dots min-h-dvh bg-cream">
    <div class="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-5 pb-10 sm:px-8">
      <header class="flex items-center gap-3">
        <NuxtLink
          to="/"
          aria-label="Kembali ke beranda"
          class="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-white text-lg shadow-[0_3px_0_0_var(--color-ink)] transition focus-visible:ring-4 focus-visible:ring-sun/60 focus-visible:outline-none active:translate-y-[2px] active:shadow-none"
        >
          <span aria-hidden="true">←</span>
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <p class="truncate text-[11px] font-extrabold tracking-[0.14em] text-ink-soft uppercase">
            Mode latihan
          </p>
          <h1 class="truncate text-lg font-black">Latihan Menulis</h1>
        </div>

        <p
          class="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-extrabold text-ink-soft"
          :title="`${totalMastered} dari ${totalWords} kata dikuasai`"
        >
          <span aria-hidden="true">✏️</span>
          <span>{{ totalMastered }}/{{ totalWords }} kata</span>
        </p>
      </header>

      <section class="mt-8 sm:mt-10">
        <h2 class="text-2xl font-black tracking-tight sm:text-3xl">Pilih kategori</h2>
        <p class="mt-2 max-w-md text-sm leading-relaxed font-semibold text-ink-soft">
          Tulis nama benda dalam bahasa Inggris. Ejaan harus tepat, tapi kalau hampir benar kamu
          dapat satu kesempatan lagi.
        </p>

        <div
          class="mt-5 flex items-start gap-3 rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 px-4 py-3"
        >
          <span class="text-xl" aria-hidden="true">💡</span>
          <p class="text-xs leading-relaxed font-semibold text-ink-soft">
            Contoh: kalau soalnya <span class="font-extrabold">“kursi”</span>, tulis
            <span class="font-extrabold text-emerald-700">chair</span>. Huruf besar atau kecil tidak
            masalah.
          </p>
        </div>
      </section>

      <section class="mt-6" aria-label="Kategori latihan menulis">
        <div class="grid gap-3.5 sm:grid-cols-2">
          <VocabCategoryCard
            v-for="category in categories"
            :key="category.id"
            :category="category"
            :progress="progress[category.id]"
          />
        </div>

        <p
          v-if="!categories.length"
          class="rounded-3xl border-2 border-dashed border-ink/20 bg-white/60 p-6 text-center text-sm font-semibold text-ink-soft"
        >
          Belum ada kategori. Tambahkan file JSON di
          <code class="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">data/vocab/</code>.
        </p>
      </section>

      <footer
        class="mt-auto pt-10 text-center text-[11px] leading-relaxed font-semibold text-ink-soft/80"
      >
        Progres tersimpan di browser ini<span class="mx-1" aria-hidden="true">·</span>Kata yang
        pernah benar akan ditandai dikuasai
      </footer>
    </div>
  </div>
</template>
