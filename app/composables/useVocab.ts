import type { VocabCategory, VocabWord } from '~/types/vocab'

const modules = import.meta.glob('../../data/vocab/*.json', { eager: true }) as Record<
  string,
  { default: Partial<VocabCategory> }
>

function normalizeWord(
  raw: Partial<VocabWord>,
  categoryId: string,
  index: number,
): VocabWord | null {
  const prompt = typeof raw?.prompt === 'string' ? raw.prompt.trim() : ''
  const answer = typeof raw?.answer === 'string' ? raw.answer.trim() : ''

  if (!prompt || !answer) {
    console.warn(`[belajar-bareng] ${categoryId}: kata #${index + 1} tidak valid, dilewati.`)
    return null
  }

  const accept = Array.isArray(raw.accept)
    ? raw.accept
        .filter((item): item is string => typeof item === 'string')
        .map(item => item.trim())
        .filter(Boolean)
    : []

  const id =
    typeof raw.id === 'string' && raw.id.trim()
      ? raw.id.trim()
      : `${categoryId}-${String(index + 1).padStart(2, '0')}`

  return {
    id,
    prompt,
    answer,
    accept: accept.length ? accept : undefined,
    example: typeof raw.example === 'string' && raw.example.trim() ? raw.example.trim() : undefined,
  }
}

function normalize(raw: Partial<VocabCategory>, file: string): VocabCategory | null {
  const id = typeof raw?.id === 'string' ? raw.id.trim() : ''
  const name = typeof raw?.name === 'string' ? raw.name.trim() : ''

  if (!id || !name || !Array.isArray(raw.words)) {
    console.warn(`[belajar-bareng] Lewati ${file}: butuh "id", "name", dan "words".`)
    return null
  }

  const words = raw.words
    .map((word, index) => normalizeWord(word, id, index))
    .filter((word): word is VocabWord => word !== null)

  if (!words.length) {
    console.warn(`[belajar-bareng] Lewati ${file}: tidak ada kata yang valid.`)
    return null
  }

  return {
    id,
    name,
    nameEn: raw.nameEn,
    emoji: raw.emoji ?? '📚',
    theme: raw.theme,
    description: raw.description,
    order: raw.order,
    words,
  }
}

const categoryList: VocabCategory[] = Object.entries(modules)
  .map(([file, mod]) => normalize(mod.default ?? (mod as unknown as Partial<VocabCategory>), file))
  .filter((category): category is VocabCategory => category !== null)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name, 'id'))

export function useVocab() {
  function getCategory(id: string): VocabCategory | undefined {
    return categoryList.find(category => category.id === id)
  }

  return { categories: categoryList, getCategory }
}
