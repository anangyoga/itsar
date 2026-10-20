import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import type { Subject } from './app/types/quiz'

const subjectsDir = join(process.cwd(), 'data/subjects')
const subjectRoutes = readdirSync(subjectsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(readFileSync(join(subjectsDir, file), 'utf8')) as Subject)
  .map(subject => `/quiz/${subject.id}`)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['@fontsource-variable/nunito/index.css', '~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Belajar Bareng — Kuis Seru untuk Si Kecil',
      meta: [
        {
          name: 'description',
          content:
            'Aplikasi kuis sederhana untuk belajar anak. Pilih mata pelajaran, jawab soal, kumpulkan bintang.',
        },
        { name: 'theme-color', content: '#FFF7EC' },
      ],
      link: [
        {
          rel: 'icon',
          href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  nitro: {
    prerender: {
      routes: ['/', ...subjectRoutes],
    },
  },
})
