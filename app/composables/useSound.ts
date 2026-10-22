const MUTE_KEY = 'belajar-bareng:muted'

/**
 * Tiny WebAudio helper so we get feedback sounds without shipping audio files.
 * The AudioContext is created lazily on the first sound, which is always
 * triggered by a user interaction.
 */
export function useSound() {
  const muted = useState('bb-muted', () => false)
  let ctx: AudioContext | null = null

  function restore() {
    if (!import.meta.client) return
    try {
      muted.value = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      // Ignore storage errors.
    }
  }

  function toggle() {
    muted.value = !muted.value
    if (import.meta.client) {
      try {
        localStorage.setItem(MUTE_KEY, muted.value ? '1' : '0')
      } catch {
        // Ignore storage errors.
      }
    }
  }

  function audioContext(): AudioContext | null {
    if (!import.meta.client) return null
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }

  function tone(
    frequency: number,
    {
      at = 0,
      duration = 0.16,
      type = 'sine',
      gain = 0.05,
    }: {
      at?: number
      duration?: number
      type?: OscillatorType
      gain?: number
    } = {},
  ) {
    if (muted.value) return
    const audio = audioContext()
    if (!audio) return

    const start = audio.currentTime + at
    const oscillator = audio.createOscillator()
    const volume = audio.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    volume.gain.setValueAtTime(0.0001, start)
    volume.gain.linearRampToValueAtTime(gain, start + 0.015)
    volume.gain.exponentialRampToValueAtTime(0.0001, start + duration)

    oscillator.connect(volume)
    volume.connect(audio.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }

  function playCorrect() {
    tone(523.25, { duration: 0.14 })
    tone(659.25, { at: 0.07, duration: 0.14 })
    tone(783.99, { at: 0.14, duration: 0.2 })
  }

  function playWrong() {
    tone(246.94, { type: 'triangle', duration: 0.16, gain: 0.04 })
    tone(196, { at: 0.12, type: 'triangle', duration: 0.22, gain: 0.04 })
  }

  /** Gentle two-note nudge for a spelling that is almost right. */
  function playRetry() {
    tone(392, { duration: 0.12, gain: 0.04 })
    tone(440, { at: 0.1, duration: 0.16, gain: 0.04 })
  }

  function playFinish() {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((note, index) => tone(note, { at: index * 0.11, duration: 0.24 }))
  }

  function playTap() {
    tone(587.33, { duration: 0.06, gain: 0.03 })
  }

  return {
    muted,
    toggle,
    restore,
    playCorrect,
    playWrong,
    playRetry,
    playFinish,
    playTap,
  }
}
