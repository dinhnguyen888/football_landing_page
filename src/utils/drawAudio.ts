// Web Audio API Sound Effects Synthesizer for Cinematic Tournament Draw
// Completely self-contained - zero external mp3 assets required!

class DrawAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(
        muted ? 0 : 0.03,
        this.ctx ? this.ctx.currentTime : 0
      );
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Auditorium / Studio Room Tone (Low warm hum of a massive broadcast stage)
  public startAuditoriumTone() {
    if (this.isAmbientRunning || this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 hum

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.ambientGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.025,
        this.ctx.currentTime
      );

      osc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      osc.start();
      this.isAmbientRunning = true;
    } catch {}
  }

  // 2. Camera Dolly / Whoosh Sound (Smooth optical zoom transition)
  public playCameraWhoosh() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.7);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.72);
    } catch {}
  }

  // 3. Realistic Ball Mixing & Collision (Balls swirling inside transparent bowl)
  public playBallCollisions() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const count = 14;

      for (let i = 0; i < count; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = i * 0.09 + Math.random() * 0.04;

        osc.type = 'triangle';
        // Polished plastic sphere resonance
        osc.frequency.setValueAtTime(340 + Math.random() * 260, now + delay);
        osc.frequency.exponentialRampToValueAtTime(90, now + delay + 0.035);

        gain.gain.setValueAtTime(0.08 + Math.random() * 0.04, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.04);
      }
    } catch {}
  }

  // 4. Ball Opening Sound (Delicate click and snap of sphere separating)
  public playBallOpening() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // 5. Suspense Tension Riser (Tension drone before card is turned towards camera)
  public playSuspenseRiser() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(110, now); // A2
      osc1.frequency.linearRampToValueAtTime(220, now + 1.2);

      osc2.frequency.setValueAtTime(164.81, now); // E3
      osc2.frequency.linearRampToValueAtTime(329.63, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
    } catch {}
  }

  // 6. Broadcast Reveal Chime (Prestigious TV broadcast chord when card faces camera)
  public playBroadcastReveal() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Majestic chord: D4, F#4, A4, D5 (Major broadcast prestige)
      const freqs = [293.66, 369.99, 440.0, 587.33, 880.0];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx >= 3 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.001, now + idx * 0.03);
        gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.03 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + 1.85);
      });
    } catch {}
  }

  // 7. Polite Auditorium Applause (Auditorium audience clapping softly)
  public playPoliteApplause() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // White noise bursts mimicking crowd clapping
      for (let i = 0; i < 24; i++) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const delay = i * 0.05 + Math.random() * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450 + Math.random() * 600, now + delay);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800 + Math.random() * 400, now + delay);

        gain.gain.setValueAtTime(0.04 + Math.random() * 0.03, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.045);
      }
    } catch {}
  }

  // 8. Slotted into group (Crisp broadcast graphic thud)
  public playSlotTeam() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // 9. Grand Celebration Fanfare (When all groups are completely filled)
  public playCelebration() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.1);

        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 1.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 1.15);
      });
    } catch {}
  }
}

export const drawAudio = new DrawAudioEngine();
