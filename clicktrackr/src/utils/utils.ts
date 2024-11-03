import { AdditiveMeter, Measure } from "../types/types";
import { beamingMap, subdivisions } from "../constants/constants";

export const isSameMeter = (curr: Measure, prev: Measure) => {
  if (!prev) return false;
  if (curr.display && prev.display && curr.display === prev.display) return true;
  if (curr.num === prev.num && curr.den === prev.den && !curr.display && !prev.display) return true;
  return false;
};

export const getFill = (additiveMeters: AdditiveMeter[], subdivideAll: boolean) => {
  let meterString = '';
  for (const meter of additiveMeters) {
    if (meter.numerator === 1) meterString += subdivisions[Math.log2(meter.denominator)];
    if (subdivideAll) {
      let temp = '';
      for (let i = 0; i < (meter.numerator as number); i++) {
        temp += subdivisions[Math.log2(meter.denominator)];
      }
      if (beamingMap.has(temp)) temp = beamingMap.get(temp)!;
      meterString += temp;
    } else {
      meterString += subdivisions[Math.log2(meter.denominator) - 1];
      meterString += meter.numerator === 3 ? '.' : '';
    }
  }
  return meterString;
}