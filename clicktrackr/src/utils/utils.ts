import { Measure } from "../types/types";

export const isSameMeter = (curr: Measure, prev: Measure) => {
  if (!prev) return false;
  if (curr.display && prev.display && curr.display === prev.display) return true;
  if (curr.num === prev.num && curr.den === prev.den && !curr.display && !prev.display) return true;
  return false;
};