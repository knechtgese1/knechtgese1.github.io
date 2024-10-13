import { meters } from "../constants/constants";
import Key from "./Key";
import "./Keypad.css";

type KeypadProps = {
  handleKeySelect: (key: string, num: number) => void;
};

function Keypad({handleKeySelect}: KeypadProps) {
  return (
    <div
      className="keypad"
    >
      {meters.map(meter =>
        <Key
          key={meter.display + meter.subdiv || ''}
          keystroke={meter.key}
          display={meter.display}
          subdiv={meter.subdiv}
          text={meter.text}
          handleKeySelect={handleKeySelect}
        />)}
    </div>
  );
}

export default Keypad;