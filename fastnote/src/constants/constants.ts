import { ButtonDef } from "../types/types";

export const buttonDefs: ButtonDef[] = [
  {
    index: 0,
    name: 'init',
    display: '',
    options: [1, 2],
  },
  {
    index: 1,
    name: 'consult',
    display: 'CONSULT',
    options: [3, 4, 5],
    text: 'This text will be part of the consult note.',
  },
  {
    index: 2,
    name: 'followup',
    display: 'FOLLOW-UP',
    options: [3, 4, 5],
    text: 'This text will be part of the follow-up note.',
  },
  {
    index: 3,
    name: 'esrd',
    display: 'ESRD',
    options: [],
    text: 'This addendum will be part of the ESRD note.',
  },
  {
    index: 4,
    name: 'aki',
    display: 'AKI',
    options: [],
    text: 'This addendum will be part of the AKI note.',
  },
  {
    index: 5,
    name: 'other',
    display: 'Other',
    options: [],
    text: 'This addendum will be part of the Other note.',
  },
];