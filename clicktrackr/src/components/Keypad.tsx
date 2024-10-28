import { meters } from "../constants/constants";
import Key from "./Key";
import "./Keypad.css";
import TimeSig from "./TimeSig";

type KeypadProps = {
  handleKeySelect: (key: string, num: number) => void;
};

function Keypad({handleKeySelect}: KeypadProps) {
  return (
    <div
      className="keypad"
    >
      {meters.map((meter, i) =>
        <Key
          key={i}
          keystroke={meter.key}
          subdiv={meter.subdiv}
          text={meter.text}
          handleKeySelect={handleKeySelect}
        >
          {meter.display ? <div className="single-glyph time-sig">{meter.display}</div> : <TimeSig num={meter.num!} den={meter.den!} />}
        </Key>)}
    </div>
  );
}

export default Keypad;