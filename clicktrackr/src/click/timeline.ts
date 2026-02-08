import type { Measure } from '../types/types';

export type ClickTier = 'downbeat' | 'beat' | 'sub';

export type ClickEvent = {
  timeSec: number;
  tier: ClickTier;
};

// Map the Rhythm font tokens back to musical durations.
// NOTE: The UI uses special glyph letters for beamed groups (e.g. r t y for beamed eighths,
// d f g for beamed sixteenths). For timing we treat them as the underlying durations.
const DUR_QN: Record<string, number> = {
  // basic
  w: 4,
  h: 2,
  q: 1,
  e: 0.5,
  s: 0.25,
  z: 0.125,

  // beamed eighth-note group glyphs (from beamingMap ee->ry, eee->rty)
  r: 0.5,
  t: 0.5,
  y: 0.5,

  // beamed sixteenth-note group glyphs (ss->dg, sss->dfg)
  d: 0.25,
  f: 0.25,
  g: 0.25,
};

export type TimelineOptions = {
  bpm: number; // quarter-note bpm
  countInMeasures?: number;
};

export function fillToDurationsQuarter(fill: string): number[] {
  const durations: number[] = [];
  const chars = Array.from(fill);

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];

    // Ignore separators/spaces.
    if (c === ' ' || c === '|' || c === '\\') continue;

    const base = DUR_QN[c];
    if (!base) continue;

    const next = chars[i + 1];
    if (next === '.') {
      durations.push(base * 1.5);
      i++; // consume dot
    } else {
      durations.push(base);
    }
  }

  return durations;
}

export function buildClickTimeline(measures: Measure[], opts: TimelineOptions): ClickEvent[] {
  const bpm = opts.bpm;
  const qnSec = 60 / bpm;

  const events: ClickEvent[] = [];
  let t = 0;

  const countInMeasures = opts.countInMeasures ?? 0;
  if (countInMeasures > 0) {
    const ref = measures[0];
    const refDur = ref ? fillToDurationsQuarter(ref.fill) : [1];
    for (let m = 0; m < countInMeasures; m++) {
      for (let j = 0; j < refDur.length; j++) {
        const tier: ClickTier = j === 0 ? 'downbeat' : 'sub';
        events.push({ timeSec: t, tier });
        t += refDur[j] * qnSec;
      }
    }
  }

  for (const measure of measures) {
    // If this is an additive x/8 meter with a grouping (e.g., 7/8 as 3+2+2),
    // we emit *eighth-note pulses* and tier them by grouping boundaries:
    // - downbeat (start of first group)
    // - beat (start of subsequent groups)
    // - sub (remaining eighths)
    if (measure.den === 8 && measure.grouping && measure.grouping.length > 0 && measure.num % 3 !== 0) {
      const groupStarts = groupingStarts(measure.grouping);
      const eighthSec = 0.5 * qnSec;

      for (let e = 0; e < measure.num; e++) {
        const tier: ClickTier = e === 0 ? 'downbeat' : groupStarts.has(e) ? 'beat' : 'sub';
        events.push({ timeSec: t, tier });
        t += eighthSec;
      }

      continue;
    }

    // Otherwise: emit higher-level “beat” pulses only.
    // Default is quarter-note beats.
    // For compound-style meters where numerator % 3 === 0 (e.g. 6/8, 9/16, 12/16),
    // the beat is a dotted note of value (denominator / 2): 3/(den) in whole-notes.
    // In quarter-note units, that beat length is: 3 * (4/den) = 12/den.
    const isCompound = measure.num % 3 === 0 && measure.den >= 8;
    const beatUnitQN = isCompound ? 12 / measure.den : 1;

    const totalQN = measure.num * (4 / measure.den);
    const beatsPerMeasureFloat = totalQN / beatUnitQN;
    const beatsPerMeasure = Math.max(1, Math.round(beatsPerMeasureFloat));

    const beatSec = beatUnitQN * qnSec;

    for (let b = 0; b < beatsPerMeasure; b++) {
      const tier: ClickTier = b === 0 ? 'downbeat' : 'beat';
      events.push({ timeSec: t, tier });
      t += beatSec;
    }
  }

  return events;
}

function groupingStarts(grouping: number[]): Set<number> {
  const starts = new Set<number>();
  let idx = 0;
  for (let i = 0; i < grouping.length; i++) {
    if (i > 0) starts.add(idx);
    idx += grouping[i];
  }
  return starts;
}
