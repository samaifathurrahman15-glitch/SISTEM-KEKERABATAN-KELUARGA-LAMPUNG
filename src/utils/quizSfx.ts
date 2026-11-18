// Utilitas efek suara (SFX) interaktif berbasis Web Audio API untuk Mode Kuis Siswa

type AudioContextConstructor = typeof AudioContext;

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext;
  if (!Ctx) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new Ctx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {
      // Abaikan jika peramban belum mengizinkan audio
    });
  }
  return sharedAudioCtx;
}

/**
 * Suara 'ting' cerah saat siswa memilih jawaban benar.
 */
export function playCorrectSfx(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Nada pertama (C6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Nada kedua (E6) untuk kesan 'ting' nyaring
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, now + 0.075);
    gain2.gain.setValueAtTime(0.001, now + 0.075);
    gain2.gain.exponentialRampToValueAtTime(0.24, now + 0.095);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.075);
    osc2.stop(now + 0.44);
  } catch {
    // Abaikan kegagalan pemutaran audio
  }
}

/**
 * Suara 'buzzer' lembut namun tegas saat jawaban siswa kurang tepat.
 */
export function playWrongSfx(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  } catch {
    // Abaikan kegagalan pemutaran audio
  }
}

/**
 * Suara penanda waktu habis saat timer hitung mundur mencapai 0.
 */
export function playTimeoutSfx(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 330];

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.17);
    });
  } catch {
    // Abaikan kegagalan pemutaran audio
  }
}

/**
 * Fanfare singkat saat siswa menyelesaikan sesi kuis atau juara duel ditentukan.
 */
export function playVictorySfx(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.09;
      const duration = idx === notes.length - 1 ? 0.38 : 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.02);
    });
  } catch {
    // Abaikan kegagalan pemutaran audio
  }
}
