/** Fisher–Yates shuffle, returns a new array. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

/** Turns a best score (0–100) into 0–3 stars. */
export function starsFor(best: number | undefined): number {
  if (best === undefined) return 0
  if (best >= 90) return 3
  if (best >= 60) return 2
  if (best > 0) return 1
  return 0
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function scoreMessage(score: number): { title: string; subtitle: string } {
  if (score === 100) return { title: 'Sempurna!', subtitle: 'Semua jawaban benar. Kamu hebat!' }
  if (score >= 80)
    return { title: 'Keren banget!', subtitle: 'Hampir semuanya benar. Sedikit lagi!' }
  if (score >= 60)
    return { title: 'Bagus!', subtitle: 'Kamu sudah paham sebagian besar. Ayo coba lagi!' }
  if (score > 0) return { title: 'Semangat!', subtitle: 'Setiap latihan bikin kamu makin pintar.' }
  return {
    title: 'Jangan menyerah!',
    subtitle: 'Baca lagi penjelasannya, lalu coba sekali lagi ya.',
  }
}
