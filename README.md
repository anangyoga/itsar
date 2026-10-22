# 🎓 Belajar Bareng

Aplikasi kuis sederhana untuk anak belajar. Dibangun dengan **Nuxt 4**, **Vue 3**, dan **Tailwind CSS 4**.

- Pilih mata pelajaran di beranda
- Soal & pilihan jawaban diacak setiap kali bermain
- Ada umpan balik langsung + penjelasan jawaban
- Skor terbaik, bintang, dan jumlah percobaan disimpan di `localStorage`
- Bisa "latih soal yang salah" setelah kuis selesai
- **Latihan Menulis**: 545 kata dalam 21 kategori (bagian tubuh, hewan, tempat, makanan,
  minuman, kendaraan, cuaca, dan lainnya)
  - Ejaan dicek tanpa peduli huruf besar/kecil
  - Kalau hanya salah satu huruf, dapat satu kesempatan memperbaiki
  - Kata yang pernah benar ditandai "dikuasai"
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

## Format kode

Proyek memakai [Prettier](https://prettier.io) dengan plugin pengurut kelas Tailwind.

```bash
pnpm format        # rapikan semua file
pnpm format:check  # cek format tanpa mengubah file
```

Di VS Code/Cursor, format otomatis saat menyimpan sudah diatur lewat
`.vscode/settings.json` — cukup setujui rekomendasi ekstensi Prettier saat membuka proyek.

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

| Field         | Wajib | Keterangan                                                   |
| ------------- | ----- | ------------------------------------------------------------ |
| `id`          | ✅    | Huruf kecil, tanpa spasi (dipakai di URL).                   |
| `name`        | ✅    | Nama yang tampil di beranda.                                 |
| `emoji`       | ✅    | Ikon mata pelajaran.                                         |
| `theme`       | –     | `sun`, `sky`, `grass`, `grape`, atau `berry`. Default `sun`. |
| `grade`       | –     | Contoh: `Kelas 3 SD`.                                        |
| `description` | –     | Belum ditampilkan, aman untuk catatan.                       |
| `order`       | –     | Angka kecil tampil lebih dulu.                               |
| `questions`   | ✅    | Minimal 1 soal.                                              |

Per soal:

| Field         | Wajib | Keterangan                                                 |
| ------------- | ----- | ---------------------------------------------------------- |
| `question`    | ✅    | Pertanyaan.                                                |
| `options`     | ✅    | 2–6 pilihan jawaban.                                       |
| `answer`      | ✅    | **Index** jawaban benar, dimulai dari `0`.                 |
| `explanation` | –     | Penjelasan yang muncul setelah menjawab.                   |
| `passage`     | –     | Teks bacaan yang tampil di atas pertanyaan (untuk cerita). |

> ⚠️ `answer: 0` berarti pilihan **pertama** benar. Kalau menambah pilihan baru,
> pastikan index jawaban benar ikut disesuaikan.

Soal yang formatnya salah akan dilewati dan muncul peringatan di terminal saat dev.

## Menambah / mengubah latihan menulis

Data latihan menulis ada di **`data/vocab/*.json`** — satu file per kategori.
Sama seperti soal, file baru otomatis muncul di halaman `/vocab`.

```json
{
  "id": "buah",
  "name": "Buah-buahan",
  "nameEn": "Fruits",
  "emoji": "🍎",
  "theme": "berry",
  "description": "Nama buah-buahan dalam bahasa Inggris.",
  "order": 1,
  "words": [
    {
      "id": "buah-01",
      "prompt": "apel",
      "answer": "apple",
      "example": "I eat an apple every morning."
    },
    {
      "id": "buah-02",
      "prompt": "salak",
      "answer": "snake fruit",
      "accept": ["salacca"],
      "example": "Salak is also called snake fruit."
    }
  ]
}
```

| Field         | Wajib | Keterangan                                                   |
| ------------- | ----- | ------------------------------------------------------------ |
| `id`          | ✅    | Huruf kecil, tanpa spasi (dipakai di URL).                   |
| `name`        | ✅    | Nama kategori yang tampil.                                   |
| `nameEn`      | –     | Nama kategori dalam bahasa Inggris.                          |
| `emoji`       | –     | Ikon kategori. Default `📚`.                                 |
| `theme`       | –     | `sun`, `sky`, `grass`, `grape`, atau `berry`. Default `sun`. |
| `description` | –     | Catatan kategori (belum ditampilkan).                        |
| `order`       | –     | Angka kecil tampil lebih dulu.                               |
| `words`       | ✅    | Minimal 1 kata.                                              |

Per kata:

| Field     | Wajib | Keterangan                                        |
| --------- | ----- | ------------------------------------------------- |
| `prompt`  | ✅    | Kata Indonesia yang ditanyakan (tunggal).         |
| `answer`  | ✅    | Ejaan bahasa Inggris yang benar (tunggal).        |
| `id`      | –     | ID unik untuk menandai kata yang sudah dikuasai.  |
| `accept`  | –     | Ejaan lain yang juga diterima, mis. `["fridge"]`. |
| `example` | –     | Contoh kalimat yang muncul setelah menjawab.      |

> Pengecekan tidak peduli huruf besar/kecil, spasi berlebih, atau tanda kutip
> melengkung. Jawaban harus tetap **satu kata/bentuk yang sama** — bentuk jamak
> tidak otomatis diterima kecuali ditambahkan ke `accept`.

## Struktur proyek

```
data/subjects/        # 📝 data soal pilihan ganda (JSON)
data/vocab/           # ✍️ data latihan menulis per kategori (JSON)
app/
  assets/css/main.css # tema + animasi Tailwind
  components/         # SubjectCard, AnswerButton, QuizProgress, QuizResult, SoundToggle,
                      # VocabCategoryCard, VocabResult, StarConfetti
  composables/        # useSubjects, useQuiz, useProgress, useSound,
                      # useVocab, useSpellingQuiz, useVocabProgress
  pages/
    index.vue         # beranda
    quiz/[subject].vue# halaman kuis pilihan ganda
    vocab/index.vue   # daftar kategori latihan menulis
    vocab/[category].vue # halaman latihan menulis
  types/              # tipe data kuis & vocab
  utils/              # shuffle, bintang, tema warna, normalisasi ejaan
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
