import { meters } from "../constants/constants";
import Key from "./Key";
import "./Keypad.css";

function Keypad() {
  return (
    <div className="keypad">
      {meters.map(meter =>
        <Key
          key={meter.display}
          keystroke={meter.key}
          display={meter.display}
          subdiv={meter.subdiv}
          text={meter.text}
        />)}
    </div>
  );
}

export default Keypad;