export type Meter = {
  key: string;
  display?: string;
  alt?: string;
  text?: boolean;
  num?: number;
  den?: number;
  subdiv?: number[];
  defaultFill?: string;
}

export type Measure = {
  /** Time signature numerator */
  num: number;
  /** Time signature denominator */
  den: number;
  /** Optional display glyph (e.g. common time/cut time) */
  display?: string;
  /** Optional alt text for the display glyph */
  alt?: string;
  /** Rhythm fill string rendered with the Rhythm font (display-oriented) */
  fill: string;
  /**
   * Additive grouping in units of the denominator.
   * Example: 7/8 as 3+2+2 => [3, 2, 2]
   */
  grouping?: number[];
}

export type AdditiveMeter = {
  id?: string;
  numerator: number | '';
  denominator: number;
}