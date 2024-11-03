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
  meter: string | JSX.Element;
  display?: string;
  num?: number;
  den?: number;
  fill: string;
}

export type AdditiveMeter = {
  id?: string;
  numerator: number | '';
  denominator: number;
}