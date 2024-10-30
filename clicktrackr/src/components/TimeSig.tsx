import "./TimeSig.css";
import { convertToMaestro } from "../constants/constants";

type TimeSigProps = {
  display?: string;
  alt?: string;
  num?: number;
  den?: number
}

function TimeSig({num, den, display, alt}: TimeSigProps) {
  if (num && den) return (
    <div className="time-sig" aria-label={`${num} ${den}`}>
      <div className="num">{convertToMaestro(num)}</div>
      <div className="den">{convertToMaestro(den)}</div>
    </div>
  )
  return <div className="time-sig single-glyph" aria-label={alt}>{display}</div>
}

export default TimeSig;