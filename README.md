# 🎓 Belajar Bareng

Aplikasi kuis sederhana untuk anak belajar. Dibangun dengan **Nuxt 4**, **Vue 3**, dan **Tailwind CSS 4**.

- Pilih mata pelajaran di beranda
- Soal & pilihan jawaban diacak setiap kali bermain
- Ada umpan balik langsung + penjelasan jawaban
- Skor terbaik, bintang, dan jumlah percobaan disimpan di `localStorage`
- Bisa "latih soal yang salah" setelah kuis selesai
- Suara benar/salah memakai WebAudio (tanpa file audio), bisa dimatikan
- Responsif, ramah keyboard (`1`–`4` untuk memilih, `Enter` untuk lanjut)

## Menjalankan

```bash
pnpm install
pnpm dev
```

Buka http://localhost:3000

> Memakai npm juga bisa: `npm install && npm run dev`.
> Cek tipe: `pnpm typecheck`.

## Menambah / mengubah soal

Semua soal ada di **`data/subjects/*.json`** — satu file per mata pelajaran.
File baru otomatis muncul di beranda, tidak perlu mengubah kode.

```json
{
  "id": "bahasa-inggris",
  "name": "Bahasa Inggris",
  "emoji": "🇬🇧",
  "theme": "grape",
  "grade": "Kelas 3 SD",
  "description": "Kosakata sehari-hari.",
  "order": 4,
  "questions": [
    {
      "id": "eng-01",
      "passage": "Teks bacaan opsional.",
      "question": "What is the English word for \"buku\"?",
      "options": ["Book", "Ball", "Bag", "Bed"],
      "answer": 0,
      "explanation": "\"Buku\" dalam bahasa Inggris adalah book."
    }
  ]
}
```

### Aturan field

| Field         | Wajib | Keterangan                                                        |
| ------------- | ----- | ----------------------------------------------------------------- |
| `id`          | ✅    | Huruf kecil, tanpa spasi (dipakai di URL).                        |
| `name`        | ✅    | Nama yang tampil di beranda.                                      |
| `emoji`       | ✅    | Ikon mata pelajaran.                                              |
| `theme`       | –     | `sun`, `sky`, `grass`, `grape`, atau `berry`. Default `sun`.      |
| `grade`       | –     | Contoh: `Kelas 3 SD`.                                             |
| `description` | –     | Belum ditampilkan, aman untuk catatan.                            |
| `order`       | –     | Angka kecil tampil lebih dulu.                                    |
| `questions`   | ✅    | Minimal 1 soal.                                                   |

Per soal:

| Field         | Wajib | Keterangan                                                  |
| ------------- | ----- | ----------------------------------------------------------- |
| `question`    | ✅    | Pertanyaan.                                                 |
| `options`     | ✅    | 2–6 pilihan jawaban.                                        |
| `answer`      | ✅    | **Index** jawaban benar, dimulai dari `0`.                  |
| `explanation` | –     | Penjelasan yang muncul setelah menjawab.                     |
| `passage`     | –     | Teks bacaan yang tampil di atas pertanyaan (untuk cerita).  |

> ⚠️ `answer: 0` berarti pilihan **pertama** benar. Kalau menambah pilihan baru,
> pastikan index jawaban benar ikut disesuaikan.

Soal yang formatnya salah akan dilewati dan muncul peringatan di terminal saat dev.

## Struktur proyek

```
data/subjects/        # 📝 data soal (JSON)
app/
  assets/css/main.css # tema + animasi Tailwind
  components/         # SubjectCard, AnswerButton, QuizProgress, QuizResult, SoundToggle
  composables/        # useSubjects, useQuiz, useProgress, useSound
  pages/
    index.vue         # beranda
    quiz/[subject].vue# halaman kuis
  types/quiz.ts       # tipe data
  utils/              # shuffle, bintang, tema warna
nuxt.config.ts
```

## Build & deploy

```bash
pnpm generate   # hasil statis di .output/public
pnpm preview
```

Karena data soal dibundel saat build, folder `.output/public` bisa langsung
di-upload ke Netlify, Vercel, Cloudflare Pages, GitHub Pages, atau hosting statis
lain. Setelah mengubah soal, jalankan `pnpm generate` lalu upload ulang.

## Ide pengembangan selanjutnya

- Mode "ulangi sampai benar" tanpa skor
- Pilihan jumlah soal per sesi
- Profil beberapa anak
- Soal isian singkat / mencocokkan gambar
- Sinkronisasi progres ke akun (butuh backend)
