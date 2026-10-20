<script setup lang="ts">
const { subjects } = useSubjects()
const { progress, load } = useProgress()

const greeting = ref('Halo')

const totalStars = computed(() =>
  Object.values(progress.value).reduce((sum, item) => sum + starsFor(item.best), 0),
)

onMounted(() => {
  load()

  const hour = new Date().getHours()
  greeting.value =
    hour < 11
      ? 'Selamat pagi'
      : hour < 15
        ? 'Selamat siang'
        : hour < 18
          ? 'Selamat sore'
          : 'Selamat malam'
})
</script>

<template>
  <div class="bg-dots min-h-dvh bg-cream">
    <div class="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-6 pb-10 sm:px-8">
      <header class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            class="grid size-11 place-items-center rounded-2xl border-[3px] border-ink bg-sun text-xl shadow-[0_4px_0_0_var(--color-ink)]"
            aria-hidden="true"
          >
            🎓
          </div>
          <div>
            <p class="text-lg leading-none font-black">Belajar Bareng</p>
            <p class="mt-1 text-[11px] font-bold text-ink-soft">Kuis harian buat si kecil</p>
          </div>
        </div>

        <p
          class="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-extrabold text-ink-soft"
          :title="totalStars > 0 ? `${totalStars} bintang terkumpul` : 'Belum ada bintang'"
        >
          <span aria-hidden="true">⭐</span>
          <span>{{ totalStars }} bintang</span>
        </p>
      </header>

      <section class="relative mt-9 sm:mt-12">
        <p
          class="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-xs font-extrabold text-ink-soft"
        >
          {{ greeting }} 👋
        </p>

        <h1
          class="mt-4 max-w-lg text-[2.4rem] leading-[1.03] font-black tracking-tight text-balance sm:text-6xl"
        >
          Mau belajar <span class="text-berry">apa</span> hari ini?
        </h1>

        <p class="mt-4 max-w-md text-base leading-relaxed font-semibold text-ink-soft">
          Pilih mata pelajaran, jawab soal-soalnya, dan kumpulkan bintang. Tidak perlu buru-buru.
        </p>

        <div
          class="pointer-events-none absolute -top-6 right-0 hidden select-none md:block"
          aria-hidden="true"
        >
          <div
            class="animate-float rotate-3 rounded-[30px] border-[3px] border-ink bg-white p-6 shadow-[0_8px_0_0_var(--color-ink)]"
          >
            <span class="text-6xl">🦉</span>
          </div>
          <span class="absolute -top-4 -left-7 text-3xl">✨</span>
          <span class="absolute -right-4 -bottom-2 text-2xl">📚</span>
        </div>
      </section>

      <section class="mt-8 sm:mt-11" aria-labelledby="subject-heading">
        <h2
          id="subject-heading"
          class="mb-3 text-xs font-extrabold tracking-[0.16em] text-ink-soft uppercase"
        >
          Pilih pelajaran
        </h2>

        <div class="grid gap-3.5 sm:grid-cols-2">
          <SubjectCard
            v-for="subject in subjects"
            :key="subject.id"
            :subject="subject"
            :best="progress[subject.id]?.best"
          />
        </div>

        <p
          v-if="!subjects.length"
          class="rounded-3xl border-2 border-dashed border-ink/20 bg-white/60 p-6 text-center text-sm font-semibold text-ink-soft"
        >
          Belum ada mata pelajaran. Tambahkan file JSON di
          <code class="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">data/subjects/</code>.
        </p>
      </section>

      <footer
        class="mt-auto pt-10 text-center text-[11px] leading-relaxed font-semibold text-ink-soft/80"
      >
        Progres tersimpan di browser, bukan di perangkat yang digunakan<span
          class="mx-1"
          aria-hidden="true"
          >·</span
        >
      </footer>
    </div>
  </div>
</template>
