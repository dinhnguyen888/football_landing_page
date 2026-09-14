// Web Audio API Professional Orchestral & Broadcast Sound Engine
// Realistic Gala SFX & Procedural UEFA / Champions League Orchestral Soundtrack
// Zero external asset dependencies - 100% reliable, zero latency!

export type BackgroundMusicType = 'champions' | 'gala' | 'ambient' | 'none';

class DrawAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.75;
  private currentTrack: BackgroundMusicType = 'champions';
  private isMusicPlayingState: boolean = false;

  // Background Ambience / Pad nodes
  private ambientGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;

  // Background Music Sequencer
  private musicIntervalId: number | null = null;
  private musicGainNode: GainNode | null = null;
  private musicStep: number = 0;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        muted ? 0 : 0.04,
        this.ctx.currentTime
      );
    }
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(
        muted ? 0 : this.musicVolume,
        this.ctx.currentTime
      );
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGainNode && this.ctx && !this.isMuted) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setTrack(track: BackgroundMusicType) {
    this.currentTrack = track;
    if (this.isMusicPlayingState) {
      this.stopBackgroundMusic();
      if (track !== 'none') {
        this.startBackgroundMusic();
      }
    }
  }

  public getTrack(): BackgroundMusicType {
    return this.currentTrack;
  }

  public isMusicPlaying(): boolean {
    return this.isMusicPlayingState;
  }

  // ================= 1. WARM AUDITORIUM AMBIENCE =================
  // Replaced the harsh 55Hz sawtooth buzzing with warm, prestigious room air & soft murmurs
  public startAuditoriumTone() {
    if (this.isAmbientRunning || this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      // Generate soft pink noise (warm acoustic air)
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.12;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Warm acoustic room filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.035,
        ctx.currentTime
      );

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      whiteNoise.start();
      this.isAmbientRunning = true;

      // Start background music automatically if configured
      if (this.currentTrack !== 'none' && !this.isMusicPlayingState) {
        this.startBackgroundMusic();
      }
    } catch {}
  }

  // ================= 2. PROCEDURAL UEFA / GALA BACKGROUND MUSIC =================
  // Rich, harmonic orchestral chord progression with lush strings, cello bass, and timpani
  public startBackgroundMusic() {
    if (this.musicIntervalId !== null) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      this.musicGainNode = ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.musicVolume,
        ctx.currentTime
      );
      this.musicGainNode.connect(ctx.destination);
      this.isMusicPlayingState = true;

      // Chord progressions in D Major / B Minor (Classic UEFA Champions League harmony)
      const uefaChords = [
        // Chord 1: D Major (Majestic, noble)
        { bass: 73.42, notes: [293.66, 369.99, 440.0, 587.33, 739.99] },
        // Chord 2: G Major (Expansive, soaring)
        { bass: 98.0, notes: [293.66, 392.0, 493.88, 587.33, 783.99] },
        // Chord 3: A Major (Triumphant buildup)
        { bass: 110.0, notes: [277.18, 329.63, 440.0, 554.37, 880.0] },
        // Chord 4: B Minor (Dramatic prestige)
        { bass: 61.74, notes: [293.66, 369.99, 440.0, 587.33, 739.99] },
      ];

      const galaChords = [
        // Elegant cinematic strings
        { bass: 65.41, notes: [261.63, 329.63, 392.0, 523.25, 659.25] },
        { bass: 87.31, notes: [261.63, 349.23, 440.0, 523.25, 698.46] },
        { bass: 98.0, notes: [293.66, 392.0, 493.88, 587.33, 783.99] },
        { bass: 110.0, notes: [277.18, 329.63, 440.0, 554.37, 880.0] },
      ];

      const stepDuration = 2.4; // seconds per chord measure

      const playNextMeasure = () => {
        if (!this.ctx || !this.musicGainNode || !this.isMusicPlayingState) return;
        const now = this.ctx.currentTime;
        const chords = this.currentTrack === 'gala' ? galaChords : uefaChords;
        const currentChord = chords[this.musicStep % chords.length];
        this.musicStep++;

        // A. Warm Bowed Cello / Double Bass
        const bassOsc = this.ctx.createOscillator();
        const bassFilter = this.ctx.createBiquadFilter();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(currentChord.bass, now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(180, now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.18 * this.musicVolume, now + 0.5);
        bassGain.gain.linearRampToValueAtTime(0.14 * this.musicVolume, now + stepDuration - 0.3);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGainNode);

        bassOsc.start(now);
        bassOsc.stop(now + stepDuration);

        // B. Pulsing Baroque Strings Arpeggio (Just like the Champions League Zadok the Priest intro!)
        const noteDuration = stepDuration / 8; // 8 sixteenth-note pulses
        for (let i = 0; i < 8; i++) {
          const noteTime = now + i * noteDuration;
          const noteFreq = currentChord.notes[i % currentChord.notes.length];

          const strOsc = this.ctx.createOscillator();
          const strFilter = this.ctx.createBiquadFilter();
          const strGain = this.ctx.createGain();

          strOsc.type = 'triangle';
          strOsc.frequency.setValueAtTime(noteFreq, noteTime);

          // Subtle string acoustic resonance
          strFilter.type = 'bandpass';
          strFilter.frequency.setValueAtTime(noteFreq * 1.5, noteTime);
          strFilter.Q.setValueAtTime(1.4, noteTime);

          strGain.gain.setValueAtTime(0.001, noteTime);
          strGain.gain.linearRampToValueAtTime(0.08 * this.musicVolume, noteTime + 0.04);
          strGain.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration * 0.9);

          strOsc.connect(strFilter);
          strFilter.connect(strGain);
          strGain.connect(this.musicGainNode);

          strOsc.start(noteTime);
          strOsc.stop(noteTime + noteDuration);
        }

        // C. Soft Warm Brass Harmony Pad
        const padOsc = this.ctx.createOscillator();
        const padFilter = this.ctx.createBiquadFilter();
        const padGain = this.ctx.createGain();

        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(currentChord.notes[1], now);

        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(500, now);

        padGain.gain.setValueAtTime(0.001, now);
        padGain.gain.linearRampToValueAtTime(0.1 * this.musicVolume, now + 0.6);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration);

        padOsc.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(this.musicGainNode);

        padOsc.start(now);
        padOsc.stop(now + stepDuration);
      };

      playNextMeasure();
      this.musicIntervalId = window.setInterval(playNextMeasure, stepDuration * 1000);
    } catch {}
  }

  public stopBackgroundMusic() {
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.isMusicPlayingState = false;
  }

  public toggleBackgroundMusic(): boolean {
    if (this.isMusicPlayingState) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  // ================= 3. CINEMATIC CAMERA WHOOSH =================
  public playCameraWhoosh() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.65);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14 * this.sfxVolume, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.68);
    } catch {}
  }

  // ================= 4. REALISTIC BALL MIXING (ACRYLIC BALL CLACKS) =================
  public playBallCollisions() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const clackCount = 12;

      for (let i = 0; i < clackCount; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = i * 0.11 + Math.random() * 0.05;

        osc.type = 'triangle';
        // Resonance of smooth polished lottery sphere
        const baseFreq = 420 + Math.random() * 180;
        osc.frequency.setValueAtTime(baseFreq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(110, now + delay + 0.035);

        gain.gain.setValueAtTime(0.09 * this.sfxVolume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.04);
      }
    } catch {}
  }

  // ================= 5. LUXURY BALL LATCH RELEASE =================
  public playBallOpening() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // ================= 6. CINEMATIC TIMPANI DRUM ROLL & TENSION RISER =================
  // Replaced the harsh dual-sawtooth siren with a grand orchestral Timpani drum roll
  public playSuspenseRiser() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 1.4;
      const hitCount = 16; // rapid alternating orchestral timpani strokes

      // A. Rapid Timpani Drum Strokes (Crescendo)
      for (let i = 0; i < hitCount; i++) {
        const hitTime = now + (i / hitCount) * duration;
        const progress = i / hitCount; // 0.0 -> 1.0

        const timpOsc = ctx.createOscillator();
        const timpGain = ctx.createGain();

        timpOsc.type = 'triangle';
        // Deep timpani skin resonance
        const f = 62 + progress * 24;
        timpOsc.frequency.setValueAtTime(f, hitTime);
        timpOsc.frequency.exponentialRampToValueAtTime(f * 0.75, hitTime + 0.07);

        const strokeVolume = (0.04 + progress * 0.22) * this.sfxVolume;
        timpGain.gain.setValueAtTime(strokeVolume, hitTime);
        timpGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.07);

        timpOsc.connect(timpGain);
        timpGain.connect(ctx.destination);

        timpOsc.start(hitTime);
        timpOsc.stop(hitTime + 0.075);
      }

      // B. Low Symphonic Tension Drone Swell
      const droneOsc = ctx.createOscillator();
      const droneFilter = ctx.createBiquadFilter();
      const droneGain = ctx.createGain();

      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(110, now);
      droneOsc.frequency.linearRampToValueAtTime(146.83, now + duration); // A2 -> D3

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(200, now);
      droneFilter.frequency.linearRampToValueAtTime(450, now + duration);

      droneGain.gain.setValueAtTime(0.01, now);
      droneGain.gain.linearRampToValueAtTime(0.14 * this.sfxVolume, now + duration * 0.85);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);

      droneOsc.start(now);
      droneOsc.stop(now + duration);
    } catch {}
  }

  // ================= 7. MAJESTIC BROADCAST BRASS FANFARE & STADIUM CHIME =================
  // Replaced the 5 cheap triangle bleeps with a triumphant Royal Brass Section chord & Stadium Bell
  public playBroadcastReveal() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      // A. Royal Brass Section Chord: D3, A3, F#4, D5, A5 (Major Triumphant Majesty)
      const brassNotes = [
        { freq: 146.83, gain: 0.2 },  // Trombone/Bass
        { freq: 220.0, gain: 0.18 },  // French Horn
        { freq: 369.99, gain: 0.16 }, // Tenor Trumpet
        { freq: 587.33, gain: 0.18 }, // Lead Trumpet
        { freq: 880.0, gain: 0.14 },  // High Trumpet
      ];

      brassNotes.forEach((note) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        // Sawtooth with resonant filter generates the authentic "brass bite"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, now);

        filter.type = 'lowpass';
        // Brass acoustic envelope: bright attack opening quickly then settling
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.05);
        filter.frequency.exponentialRampToValueAtTime(900, now + 1.8);
        filter.Q.setValueAtTime(2.2, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(note.gain * this.sfxVolume, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.1);
      });

      // B. Golden Stadium Chime / Tubular Bell
      const chimeFreqs = [1174.66, 1760.0, 2349.32]; // High D harmonics
      chimeFreqs.forEach((freq, idx) => {
        if (!ctx) return;
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + idx * 0.02);

        chimeGain.gain.setValueAtTime(0.08 * this.sfxVolume, now + idx * 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        chimeOsc.start(now + idx * 0.02);
        chimeOsc.stop(now + 2.5);
      });

      // C. Deep Sub-Bass Impact Boom
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();

      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(80, now);
      boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.6);

      boomGain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      boomOsc.connect(boomGain);
      boomGain.connect(ctx.destination);

      boomOsc.start(now);
      boomOsc.stop(now + 0.85);
    } catch {}
  }

  // ================= 8. REALISTIC AUDITORIUM APPLAUSE =================
  // Replaced the 24 random chirping sine beeps with multi-layered acoustic handclaps
  public playPoliteApplause() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const clapCount = 38; // 38 realistic individual handclaps over 2.4 seconds

      for (let i = 0; i < clapCount; i++) {
        // Claps cluster with natural audience distribution
        const delay = (i / clapCount) * 2.2 + Math.random() * 0.08;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        // Acoustic resonance of hands clapping: 1100Hz - 2200Hz
        const centerFreq = 1200 + Math.random() * 900;
        osc.frequency.setValueAtTime(centerFreq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(280, now + delay + 0.025);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(centerFreq, now + delay);
        filter.Q.setValueAtTime(1.5, now + delay);

        // Envelope: Swells in the middle, decays naturally
        const intensity = Math.sin((i / clapCount) * Math.PI);
        const clapGain = (0.05 + intensity * 0.12) * this.sfxVolume;

        gain.gain.setValueAtTime(clapGain, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.035);
      }
    } catch {}
  }

  // ================= 9. HUD CONFIRMATION CHIME (SLOT TEAM) =================
  public playSlotTeam() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.1); // A5

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  // ================= 10. GRAND VICTORY CELEBRATION FANFARE =================
  public playCelebration() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Grand coronation chord sequence: D4 -> G4 -> A4 -> D5
      const fanfareChords = [
        { time: 0.0, notes: [293.66, 369.99, 440.0], dur: 0.35 },
        { time: 0.38, notes: [392.0, 493.88, 587.33], dur: 0.35 },
        { time: 0.76, notes: [440.0, 554.37, 659.25], dur: 0.4 },
        { time: 1.2, notes: [587.33, 739.99, 880.0, 1174.66], dur: 2.2 },
      ];

      fanfareChords.forEach((chord) => {
        chord.notes.forEach((freq) => {
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + chord.time);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, now + chord.time);
          filter.frequency.exponentialRampToValueAtTime(3600, now + chord.time + 0.05);
          filter.frequency.exponentialRampToValueAtTime(1400, now + chord.time + chord.dur);
          filter.Q.setValueAtTime(1.8, now + chord.time);

          gain.gain.setValueAtTime(0.001, now + chord.time);
          gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, now + chord.time + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + chord.time);
          osc.stop(now + chord.time + chord.dur + 0.05);
        });
      });

      // Accompany with enthusiastic crowd applause
      setTimeout(() => {
        this.playPoliteApplause();
      }, 700);
    } catch {}
  }
}

export const drawAudio = new DrawAudioEngine();
