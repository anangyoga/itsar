import type { Subject } from '~/types/quiz'

const modules = import.meta.glob('../../data/subjects/*.json', { eager: true }) as Record<
  string,
  { default: Subject }
>

function normalize(raw: Subject, file: string): Subject | null {
  if (!raw?.id || !raw.name || !Array.isArray(raw.questions)) {
    console.warn(`[belajar-bareng] Lewati ${file}: butuh "id", "name", dan "questions".`)
    return null
  }

  const questions = raw.questions.filter((question, index) => {
    const valid =
      typeof question?.question === 'string' &&
      Array.isArray(question.options) &&
      question.options.length >= 2 &&
      Number.isInteger(question.answer) &&
      question.answer >= 0 &&
      question.answer < question.options.length

    if (!valid) {
      console.warn(`[belajar-bareng] ${file}: soal #${index + 1} tidak valid, dilewati.`)
    }
    return valid
  })

  return { ...raw, questions }
}

const subjectList: Subject[] = Object.entries(modules)
  .map(([file, mod]) => normalize(mod.default ?? (mod as unknown as Subject), file))
  .filter((subject): subject is Subject => subject !== null)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name, 'id'))

export function useSubjects() {
  function getSubject(id: string): Subject | undefined {
    return subjectList.find(subject => subject.id === id)
  }

  // The data is static and bundled at build time, so it does not need to be
  // reactive state (and it keeps the HTML payload small).
  return { subjects: subjectList, getSubject }
}
