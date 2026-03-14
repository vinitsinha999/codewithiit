/**
 * src/hooks/useSound.js
 * Duolingo-style 8-bit game sounds using Web Audio API
 * No external files needed — all sounds generated programmatically
 */

const getCtx = (() => {
  let ctx = null
  return () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }
})()

// Core tone player
function playTone({ freq, type = 'square', gain = 0.3, start = 0, dur = 0.08, ctx }) {
  const osc = ctx.createOscillator()
  const vol = ctx.createGain()
  osc.connect(vol)
  vol.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
  vol.gain.setValueAtTime(0, ctx.currentTime + start)
  vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01)
  vol.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur)
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + dur + 0.05)
}

// ─── SOUNDS ────────────────────────────────────────────────

/**
 * ✅ CORRECT — Duolingo-style rising chime (C → E → G arpeggio)
 * Bright, satisfying, celebratory
 */
export function playCorrect() {
  const ctx = getCtx()
  const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone({ freq, type: 'square', gain: 0.25, start: i * 0.07, dur: 0.12, ctx })
  })
  // Add a sparkle layer
  const sparkle = [1047, 1319, 1568]
  sparkle.forEach((freq, i) => {
    playTone({ freq, type: 'sine', gain: 0.08, start: 0.28 + i * 0.05, dur: 0.1, ctx })
  })
}

/**
 * ❌ WRONG — Descending buzzer (classic game wrong sound)
 * Low thud + descending wobble
 */
export function playWrong() {
  const ctx = getCtx()
  // Low thud
  playTone({ freq: 200, type: 'square', gain: 0.3, start: 0, dur: 0.05, ctx })
  // Descending
  const desc = [350, 280, 200]
  desc.forEach((freq, i) => {
    playTone({ freq, type: 'sawtooth', gain: 0.2, start: 0.05 + i * 0.06, dur: 0.08, ctx })
  })
}

/**
 * 🏆 QUIZ COMPLETE (PASS) — Victory fanfare
 * Multi-note triumphant melody like Duolingo level complete
 */
export function playVictory() {
  const ctx = getCtx()
  // Main melody: C E G E G C (victory arpeggio)
  const melody = [
    { freq: 523, start: 0.00, dur: 0.10 },
    { freq: 659, start: 0.10, dur: 0.10 },
    { freq: 784, start: 0.20, dur: 0.10 },
    { freq: 659, start: 0.30, dur: 0.10 },
    { freq: 784, start: 0.40, dur: 0.10 },
    { freq: 1047, start: 0.50, dur: 0.30 },
  ]
  melody.forEach(({ freq, start, dur }) => {
    playTone({ freq, type: 'square', gain: 0.22, start, dur, ctx })
  })
  // Harmony layer
  const harmony = [
    { freq: 330, start: 0.00, dur: 0.20 },
    { freq: 392, start: 0.20, dur: 0.20 },
    { freq: 523, start: 0.50, dur: 0.30 },
  ]
  harmony.forEach(({ freq, start, dur }) => {
    playTone({ freq, type: 'sine', gain: 0.10, start, dur, ctx })
  })
  // Final sparkle burst
  ;[1047, 1175, 1319, 1568, 2093].forEach((freq, i) => {
    playTone({ freq, type: 'sine', gain: 0.07, start: 0.80 + i * 0.04, dur: 0.08, ctx })
  })
}

/**
 * 📚 QUIZ FAIL — Sad trombone / descending fail
 */
export function playFail() {
  const ctx = getCtx()
  const sad = [
    { freq: 392, start: 0.00, dur: 0.15 },
    { freq: 349, start: 0.15, dur: 0.15 },
    { freq: 311, start: 0.30, dur: 0.15 },
    { freq: 262, start: 0.45, dur: 0.35 },
  ]
  sad.forEach(({ freq, start, dur }) => {
    playTone({ freq, type: 'sawtooth', gain: 0.20, start, dur, ctx })
  })
}

/**
 * 🔘 BUTTON CLICK — Soft pixel click
 */
export function playClick() {
  const ctx = getCtx()
  playTone({ freq: 800, type: 'square', gain: 0.12, start: 0, dur: 0.04, ctx })
  playTone({ freq: 600, type: 'square', gain: 0.08, start: 0.03, dur: 0.03, ctx })
}

/**
 * ➡️ NEXT QUESTION — Subtle whoosh/tick
 */
export function playNext() {
  const ctx = getCtx()
  playTone({ freq: 440, type: 'sine', gain: 0.10, start: 0, dur: 0.05, ctx })
  playTone({ freq: 550, type: 'sine', gain: 0.08, start: 0.04, dur: 0.05, ctx })
}

/**
 * Hook — returns all sound functions
 */
export function useSound() {
  return {
    playCorrect,
    playWrong,
    playVictory,
    playFail,
    playClick,
    playNext,
  }
}

export default useSound
