import { Meter } from "../types/types";

// 0 1 2 3 4 5 6 7 8 9 c C
export const maestroChars = '';

export const HOLD_DURATION = 1000;

export const convertToMaestro = (num: number) => {
  let result = '';
  if (!num) return maestroChars[0];
  while (num > 0) {
    result = maestroChars[num % 10] + result;
    num = Math.floor(num / 10);
  }
  return result;
}

export const meters: Meter[] = [
  {
    key: '1',
    display: '',
    alt: 'common time',
    num: 4,
    den: 4,
    defaultFill: 'qqqq',
  },
  {
    key: '2',
    num: 2,
    den: 4,
    defaultFill: 'qq',
  },
  {
    key: '3',
    num: 3,
    den: 4,
    defaultFill: 'qqq',
  },
  {
    key: '4',
    num: 4,
    den: 4,
    defaultFill: 'qqqq',
  },
  {
    key: '5',
    num: 5,
    den: 4,
    defaultFill: 'qqqqq',
  },
  {
    key: '6',
    num: 6,
    den: 4,
    defaultFill: 'qqqqqq',
  },
  {
    key: 'q',
    display: '',
    alt: 'cut time',
    num: 2,
    den: 2,
    defaultFill: 'hh',
  },
  {
    key: 'w',
    num: 6,
    den: 8,
    defaultFill: 'q.q.',
  },
  {
    key: 'e',
    num: 9,
    den: 8,
    defaultFill: 'q.q.q.',
  },
  {
    key: 'r',
    num: 12,
    den: 8,
    defaultFill: 'q.q.q.q.',
  },
  {
    key: 't',
    num: 2,
    den: 2,
    defaultFill: 'hh',
  },
  {
    key: 'y',
    num: 3,
    den: 2,
    defaultFill: 'hhh',
  },
  {
    key: 'a',
    num: 2,
    den: 8,
    defaultFill: 'ry',
  },
  {
    key: 's',
    num: 3,
    den: 8,
    defaultFill: 'rty',
  },
  {
    key: 'd',
    num: 5,
    den: 8,
    subdiv: [2, 3],
    defaultFill: 'ryrty',
  },
  {
    key: 'f',
    num: 5,
    den: 8,
    subdiv: [3, 2],
    defaultFill: 'rtyry',
  },
  {
    key: 'g',
    num: 7,
    den: 8,
    subdiv: [2, 2, 3],
    defaultFill: 'ryryrty',
  },
  {
    key: 'h',
    num: 7,
    den: 8,
    subdiv: [3, 2, 2],
    defaultFill: 'rtyryry',
  },
  {
    key: 'z',
    num: 3,
    den: 16,
    defaultFill: 'e.',
  },
  {
    key: 'x',
    num: 6,
    den: 16,
    defaultFill: 'r.y.',
  },
  {
    key: 'c',
    num: 9,
    den: 16,
    defaultFill: 'r.t.y.',
  },
  {
    key: 'v',
    num: 12,
    den: 16,
    defaultFill: 'r.t.t.y.'
  },
  {
    key: 'b',
    display: '',
  },
  {
    key: 'n',
    display: '?',
    text: true,
  }
];

export const subdivisions = ['w', 'h', 'q', 'e', 's', 'z'];

export const meterNumeratorMap = '!@#$%^&*90 ~';
export const meterDenominatorMap = '12486';