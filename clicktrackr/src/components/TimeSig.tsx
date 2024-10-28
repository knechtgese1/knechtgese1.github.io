import "./TimeSig.css";
import { convertToMaestro } from "../constants/constants";

type TimeSigProps = {
  num: number;
  den: number
}

function TimeSig({num, den}: TimeSigProps) {
  return (
    <div className="time-sig" aria-label={`${num} ${den}`}>
      <div className="num">{convertToMaestro(num)}</div>
      <div className="den">{convertToMaestro(den)}</div>
    </div>
  );
}

export default TimeSig;