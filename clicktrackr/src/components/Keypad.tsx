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
      {meters.map((meter, i) =>
        <Key
          key={i}
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