import type { ThemeName } from '~/types/quiz'

interface Theme {
  /** Icon tile background. */
  solid: string
  /** Accent text colour (best score, labels). */
  text: string
  /** Very light tint for backgrounds. */
  soft: string
  /** Ring colour for focus states. */
  ring: string
}

export const subjectThemes: Record<ThemeName, Theme> = {
  sun: {
    solid: 'bg-amber-300',
    text: 'text-amber-700',
    soft: 'bg-amber-50',
    ring: 'focus-visible:ring-amber-300',
  },
  sky: {
    solid: 'bg-sky-300',
    text: 'text-sky-700',
    soft: 'bg-sky-50',
    ring: 'focus-visible:ring-sky-300',
  },
  grass: {
    solid: 'bg-emerald-300',
    text: 'text-emerald-700',
    soft: 'bg-emerald-50',
    ring: 'focus-visible:ring-emerald-300',
  },
  grape: {
    solid: 'bg-violet-300',
    text: 'text-violet-700',
    soft: 'bg-violet-50',
    ring: 'focus-visible:ring-violet-300',
  },
  berry: {
    solid: 'bg-orange-300',
    text: 'text-orange-700',
    soft: 'bg-orange-50',
    ring: 'focus-visible:ring-orange-300',
  },
}
