import type { ClickEvent, ClickTier } from './timeline';

export type PlayerState = {
  isPlaying: boolean;
};

export type ClickPlayerOptions = {
  downbeatFreqHz?: number;
  beatFreqHz?: number;
  subFreqHz?: number;
  clickDurationSec?: number;
  gain?: number;
  scheduleAheadSec?: number;
  tickIntervalMs?: number;
};

export class ClickPlayer {
  private audioCtx: AudioContext | null = null;
  private timer: number | null = null;
  private startAtCtxTime = 0;
  private timeline: ClickEvent[] = [];
  private nextIdx = 0;

  private opts: Required<ClickPlayerOptions>;

  constructor(opts: ClickPlayerOptions = {}) {
    this.opts = {
      downbeatFreqHz: opts.downbeatFreqHz ?? 1100,
      beatFreqHz: opts.beatFreqHz ?? 850,
      subFreqHz: opts.subFreqHz ?? 650,
      clickDurationSec: opts.clickDurationSec ?? 0.03,
      gain: opts.gain ?? 0.25,
      scheduleAheadSec: opts.scheduleAheadSec ?? 0.15,
      tickIntervalMs: opts.tickIntervalMs ?? 25,
    };
  }

  private ensureCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }
  }

  setTimeline(timeline: ClickEvent[]) {
    this.timeline = timeline;
    this.nextIdx = 0;
  }

  play() {
    if (this.timer) return;
    this.ensureCtx();

    const ctx = this.audioCtx!;
    this.startAtCtxTime = ctx.currentTime + 0.05;
    this.nextIdx = 0;

    this.timer = window.setInterval(() => this.tick(), this.opts.tickIntervalMs);
  }

  stop() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.nextIdx = 0;
  }

  getState(): PlayerState {
    return { isPlaying: !!this.timer };
  }

  private tick() {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    const now = ctx.currentTime;
    const ahead = now + this.opts.scheduleAheadSec;

    while (this.nextIdx < this.timeline.length) {
      const ev = this.timeline[this.nextIdx];
      const tAbs = this.startAtCtxTime + ev.timeSec;
      if (tAbs > ahead) break;

      this.scheduleClick(tAbs, ev.tier);
      this.nextIdx++;
    }

    // End.
    if (this.nextIdx >= this.timeline.length) {
      // Let scheduled clicks finish.
      const doneAt = this.startAtCtxTime + (this.timeline[this.timeline.length - 1]?.timeSec ?? 0) + 0.2;
      if (now > doneAt) this.stop();
    }
  }

  private scheduleClick(time: number, tier: ClickTier) {
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = this.freqForTier(tier);

    // Fast click envelope.
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(this.opts.gain, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + this.opts.clickDurationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + this.opts.clickDurationSec + 0.01);
  }

  private freqForTier(tier: ClickTier) {
    switch (tier) {
      case 'downbeat':
        return this.opts.downbeatFreqHz;
      case 'beat':
        return this.opts.beatFreqHz;
      case 'sub':
      default:
        return this.opts.subFreqHz;
    }
  }
}
