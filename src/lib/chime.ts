/**
 * Native Web Audio chime for certificate issuance
 * No external sound files or network requests required.
 */
export function playClearanceChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonious major triad arpeggio (C5 -> E5 -> G5)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.4 }, // C5
      { freq: 659.25, time: 0.12, duration: 0.5 }, // E5
      { freq: 783.99, time: 0.24, duration: 0.8 }, // G5
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.12, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.05);
    });
  } catch {
    // Audio autostart or environment limitation gracefully ignored
  }
}
