// Web Audio API Professional Orchestral & Broadcast Sound Engine
// Realistic Gala SFX & Multi-Genre Broadcast Soundtracks
// Zero external asset dependencies - 100% reliable, zero latency!

export type BackgroundMusicType = 'champions' | 'hype' | 'gala' | 'none';

class DrawAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.45;
  private sfxVolume: number = 0.75;
  private currentTrack: BackgroundMusicType = 'champions';
  private isMusicPlayingState: boolean = false;

  // Background Ambience
  private ambientGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;

  // Background Music Sequencer
  private musicIntervalId: number | null = null;
  private musicGainNode: GainNode | null = null;
  private musicStep: number = 0;

  public initCtx(): AudioContext | null {
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
        muted ? 0 : 0.035,
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
    const ctx = this.initCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Always stop current sequence
    this.stopBackgroundMusic();
    this.musicStep = 0;

    if (track !== 'none') {
      this.startBackgroundMusic();
    }
  }

  public getTrack(): BackgroundMusicType {
    return this.currentTrack;
  }

  public isMusicPlaying(): boolean {
    return this.isMusicPlayingState;
  }

  // ================= 1. WARM AUDITORIUM AMBIENCE =================
  public startAuditoriumTone() {
    if (this.isAmbientRunning || this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.12;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

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

      // Start music
      if (this.currentTrack !== 'none' && !this.isMusicPlayingState) {
        this.startBackgroundMusic();
      }
    } catch {}
  }

  // ================= 2. MULTI-GENRE DISTINCTIVE BACKGROUND TRACKS =================
  public startBackgroundMusic() {
    if (this.musicIntervalId !== null) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      this.musicGainNode = ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.musicVolume,
        ctx.currentTime
      );
      this.musicGainNode.connect(ctx.destination);
      this.isMusicPlayingState = true;

      // Set tempo and step duration based on genre
      const tempo = this.currentTrack === 'hype' ? 124 : this.currentTrack === 'champions' ? 104 : 76;
      const beatDuration = 60 / tempo; // seconds per beat

      // Track Step Interval:
      // 'hype': 1 measure = 4 beats
      // 'champions': 1 measure = 4 beats
      // 'gala': 1 measure = 4 beats
      const measureDuration = beatDuration * 4;

      const playCurrentTrackMeasure = () => {
        if (!this.ctx || !this.musicGainNode || !this.isMusicPlayingState) return;
        const now = this.ctx.currentTime;
        const step = this.musicStep;
        this.musicStep++;

        if (this.currentTrack === 'champions') {
          this.renderChampionsMeasure(now, step, measureDuration, beatDuration);
        } else if (this.currentTrack === 'hype') {
          this.renderHypeMeasure(now, step, measureDuration, beatDuration);
        } else if (this.currentTrack === 'gala') {
          this.renderGalaMeasure(now, step, measureDuration, beatDuration);
        }
      };

      // Play immediate first beat!
      playCurrentTrackMeasure();
      this.musicIntervalId = window.setInterval(playCurrentTrackMeasure, measureDuration * 1000);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // ---------------- TRACK A: 🏆 UEFA CHAMPIONS LEAGUE (Zadok The Priest) ----------------
  private renderChampionsMeasure(now: number, step: number, measureDur: number, beatDur: number) {
    if (!this.ctx || !this.musicGainNode) return;

    // D Major / B Minor / G Major classical royal chord sequence
    const chords = [
      { bass: 73.42, chord: [293.66, 369.99, 440.0, 587.33] }, // D Major
      { bass: 98.00, chord: [293.66, 392.00, 493.88, 587.33] }, // G Major
      { bass: 110.0, chord: [277.18, 329.63, 440.00, 554.37] }, // A Major
      { bass: 61.74, chord: [293.66, 369.99, 440.00, 587.33] }, // B Minor
    ];
    const cur = chords[step % chords.length];

    // 1. Cello / Double Bass Bowed Tone
    const bass = this.ctx.createOscillator();
    const bassFilter = this.ctx.createBiquadFilter();
    const bassGain = this.ctx.createGain();

    bass.type = 'sawtooth';
    bass.frequency.setValueAtTime(cur.bass, now);
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(160, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.24 * this.musicVolume, now + 0.3);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + measureDur);

    bass.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.musicGainNode);
    bass.start(now);
    bass.stop(now + measureDur);

    // 2. Rapid 16th-Note Baroque Violin Arpeggio (Iconic Champions League strings!)
    const sixteenthDur = measureDur / 16;
    for (let i = 0; i < 16; i++) {
      const noteTime = now + i * sixteenthDur;
      const noteFreq = cur.chord[i % cur.chord.length];

      const vln = this.ctx.createOscillator();
      const vlnFilter = this.ctx.createBiquadFilter();
      const vlnGain = this.ctx.createGain();

      vln.type = 'triangle';
      vln.frequency.setValueAtTime(noteFreq, noteTime);

      vlnFilter.type = 'bandpass';
      vlnFilter.frequency.setValueAtTime(noteFreq * 1.8, noteTime);
      vlnFilter.Q.setValueAtTime(1.8, noteTime);

      vlnGain.gain.setValueAtTime(0.001, noteTime);
      vlnGain.gain.linearRampToValueAtTime(0.12 * this.musicVolume, noteTime + 0.02);
      vlnGain.gain.exponentialRampToValueAtTime(0.001, noteTime + sixteenthDur * 0.85);

      vln.connect(vlnFilter);
      vlnFilter.connect(vlnGain);
      vlnGain.connect(this.musicGainNode);
      vln.start(noteTime);
      vln.stop(noteTime + sixteenthDur);
    }

    // 3. Royal Horn / Trumpet Melody (Melodic Champions League Theme)
    const melodyNotes = [587.33, 659.25, 739.99, 880.0]; // D5, E5, F#5, A5
    const horn = this.ctx.createOscillator();
    const hornFilter = this.ctx.createBiquadFilter();
    const hornGain = this.ctx.createGain();

    horn.type = 'sawtooth';
    horn.frequency.setValueAtTime(melodyNotes[step % melodyNotes.length], now);

    hornFilter.type = 'lowpass';
    hornFilter.frequency.setValueAtTime(1200, now);
    hornFilter.Q.setValueAtTime(2.0, now);

    hornGain.gain.setValueAtTime(0.001, now);
    hornGain.gain.linearRampToValueAtTime(0.16 * this.musicVolume, now + 0.4);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + measureDur * 0.9);

    horn.connect(hornFilter);
    hornFilter.connect(hornGain);
    hornGain.connect(this.musicGainNode);
    horn.start(now);
    horn.stop(now + measureDur);
  }

  // ---------------- TRACK B: 🔥 STADIUM EDM & HYPE BEAT ----------------
  private renderHypeMeasure(now: number, step: number, measureDur: number, beatDur: number) {
    if (!this.ctx || !this.musicGainNode) return;

    // 1. Four-on-the-floor Punchy Stadium Kick Drum
    for (let b = 0; b < 4; b++) {
      const kickTime = now + b * beatDur;
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, kickTime);
      kickOsc.frequency.exponentialRampToValueAtTime(36, kickTime + 0.08);

      kickGain.gain.setValueAtTime(0.35 * this.musicVolume, kickTime);
      kickGain.gain.exponentialRampToValueAtTime(0.001, kickTime + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGainNode);
      kickOsc.start(kickTime);
      kickOsc.stop(kickTime + 0.13);
    }

    // 2. Off-beat Sizzle Hi-Hats (Electronic dance groove)
    for (let b = 0; b < 4; b++) {
      const hatTime = now + (b + 0.5) * beatDur;
      const bufSize = Math.floor(this.ctx.sampleRate * 0.04);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

      const hatNoise = this.ctx.createBufferSource();
      hatNoise.buffer = buf;

      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(7000, hatTime);

      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(0.12 * this.musicVolume, hatTime);
      hatGain.gain.exponentialRampToValueAtTime(0.001, hatTime + 0.035);

      hatNoise.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.musicGainNode);
      hatNoise.start(hatTime);
    }

    // 3. Pumping Stadium Synth Bassline (16th notes groove)
    const baseFreqs = [55.0, 65.41, 73.42, 82.41]; // A1, C2, D2, E2
    const currentBase = baseFreqs[step % baseFreqs.length];

    for (let i = 0; i < 8; i++) {
      const bassTime = now + i * (beatDur / 2);
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(currentBase, bassTime);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(450, bassTime);
      bassFilter.Q.setValueAtTime(2.5, bassTime);

      bassGain.gain.setValueAtTime(0.001, bassTime);
      bassGain.gain.linearRampToValueAtTime(0.18 * this.musicVolume, bassTime + 0.02);
      bassGain.gain.exponentialRampToValueAtTime(0.001, bassTime + beatDur * 0.45);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicGainNode);
      bassOsc.start(bassTime);
      bassOsc.stop(bassTime + beatDur * 0.5);
    }

    // 4. Stadium Synth Lead Chord Stabs
    const stabChords = [
      [220.0, 261.63, 329.63], // Am
      [261.63, 329.63, 392.00], // C
      [293.66, 369.99, 440.00], // D
      [329.63, 392.00, 493.88], // Em
    ];
    const stabChord = stabChords[step % stabChords.length];

    [0, 1.5, 3].forEach((pos) => {
      const stabTime = now + pos * beatDur;
      stabChord.forEach((f) => {
        if (!this.ctx || !this.musicGainNode) return;
        const stabOsc = this.ctx.createOscillator();
        const stabFilter = this.ctx.createBiquadFilter();
        const stabGain = this.ctx.createGain();

        stabOsc.type = 'sawtooth';
        stabOsc.frequency.setValueAtTime(f, stabTime);

        stabFilter.type = 'lowpass';
        stabFilter.frequency.setValueAtTime(2200, stabTime);
        stabFilter.Q.setValueAtTime(1.5, stabTime);

        stabGain.gain.setValueAtTime(0.001, stabTime);
        stabGain.gain.linearRampToValueAtTime(0.12 * this.musicVolume, stabTime + 0.03);
        stabGain.gain.exponentialRampToValueAtTime(0.001, stabTime + beatDur * 0.35);

        stabOsc.connect(stabFilter);
        stabFilter.connect(stabGain);
        stabGain.connect(this.musicGainNode);
        stabOsc.start(stabTime);
        stabOsc.stop(stabTime + beatDur * 0.4);
      });
    });
  }

  // ---------------- TRACK C: 🎻 GALA CINEMATIC SYMPHONY ----------------
  private renderGalaMeasure(now: number, step: number, measureDur: number, beatDur: number) {
    if (!this.ctx || !this.musicGainNode) return;

    // Sweeping Hollywood cinematic orchestral chords: G Minor -> Eb Major -> Bb Major -> F Major
    const cinematicChords = [
      { bass: 48.99, mid: [196.0, 233.08, 293.66, 392.0] }, // Gm
      { bass: 38.89, mid: [155.56, 196.0, 233.08, 311.13] }, // Eb
      { bass: 58.27, mid: [233.08, 293.66, 349.23, 466.16] }, // Bb
      { bass: 43.65, mid: [174.61, 220.0, 261.63, 349.23] }, // F
    ];
    const cur = cinematicChords[step % cinematicChords.length];

    // 1. Deep Contrabass & Cello Swell
    const bass = this.ctx.createOscillator();
    const bassFilter = this.ctx.createBiquadFilter();
    const bassGain = this.ctx.createGain();

    bass.type = 'sawtooth';
    bass.frequency.setValueAtTime(cur.bass, now);
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(120, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.28 * this.musicVolume, now + 1.0);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + measureDur);

    bass.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.musicGainNode);
    bass.start(now);
    bass.stop(now + measureDur);

    // 2. Sweeping Lush String Section Pads
    cur.mid.forEach((f) => {
      if (!this.ctx || !this.musicGainNode) return;
      const str = this.ctx.createOscillator();
      const strFilter = this.ctx.createBiquadFilter();
      const strGain = this.ctx.createGain();

      str.type = 'triangle';
      str.frequency.setValueAtTime(f, now);

      strFilter.type = 'lowpass';
      strFilter.frequency.setValueAtTime(800, now);
      strFilter.Q.setValueAtTime(1.0, now);

      strGain.gain.setValueAtTime(0.001, now);
      strGain.gain.linearRampToValueAtTime(0.14 * this.musicVolume, now + 0.8);
      strGain.gain.exponentialRampToValueAtTime(0.001, now + measureDur);

      str.connect(strFilter);
      strFilter.connect(strGain);
      strGain.connect(this.musicGainNode);
      str.start(now);
      str.stop(now + measureDur);
    });

    // 3. Orchestral Timpani Strike at the top of each measure
    const timp = this.ctx.createOscillator();
    const timpGain = this.ctx.createGain();
    timp.type = 'sine';
    timp.frequency.setValueAtTime(65, now);
    timp.frequency.exponentialRampToValueAtTime(38, now + 0.25);

    timpGain.gain.setValueAtTime(0.28 * this.musicVolume, now);
    timpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    timp.connect(timpGain);
    timpGain.connect(this.musicGainNode);
    timp.start(now);
    timp.stop(now + 0.36);
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
  public playSuspenseRiser() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 1.4;
      const hitCount = 16;

      for (let i = 0; i < hitCount; i++) {
        const hitTime = now + (i / hitCount) * duration;
        const progress = i / hitCount;

        const timpOsc = ctx.createOscillator();
        const timpGain = ctx.createGain();

        timpOsc.type = 'triangle';
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

      const droneOsc = ctx.createOscillator();
      const droneFilter = ctx.createBiquadFilter();
      const droneGain = ctx.createGain();

      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(110, now);
      droneOsc.frequency.linearRampToValueAtTime(146.83, now + duration);

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
  public playBroadcastReveal() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;

      const brassNotes = [
        { freq: 146.83, gain: 0.2 },
        { freq: 220.0, gain: 0.18 },
        { freq: 369.99, gain: 0.16 },
        { freq: 587.33, gain: 0.18 },
        { freq: 880.0, gain: 0.14 },
      ];

      brassNotes.forEach((note) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, now);

        filter.type = 'lowpass';
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

      const chimeFreqs = [1174.66, 1760.0, 2349.32];
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
  public playPoliteApplause() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const clapCount = 38;

      for (let i = 0; i < clapCount; i++) {
        const delay = (i / clapCount) * 2.2 + Math.random() * 0.08;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const centerFreq = 1200 + Math.random() * 900;
        osc.frequency.setValueAtTime(centerFreq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(280, now + delay + 0.025);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(centerFreq, now + delay);
        filter.Q.setValueAtTime(1.5, now + delay);

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
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.1);

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

      setTimeout(() => {
        this.playPoliteApplause();
      }, 700);
    } catch {}
  }
}

export const drawAudio = new DrawAudioEngine();
