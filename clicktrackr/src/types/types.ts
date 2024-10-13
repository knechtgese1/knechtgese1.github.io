export type Meter = {
  key: string;
  display: string;
  text?: boolean;
  num?: number;
  den?: number;
  subdiv?: number[];
  defaultFill?: string;
}

export type Measure = {
  meter: string;
  fill: string;
}