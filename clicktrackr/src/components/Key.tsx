import './Key.css';

type KeyProps = {
  keystroke: string;
  display: string;
  subdiv?: number[];
  text?: boolean;
}


function Key({keystroke, display, subdiv, text}: KeyProps) {
  return (
    <button
      onClick={() => console.log(keystroke)}
    >
      <span className="keystroke">{keystroke}</span>
      {!text && <span>{display}</span>}
      {text && <span className="keytext">{display}</span>}
      {subdiv && <span className="subdiv">{subdiv.join(' + ')}</span>}
    </button>
  );
};

export default Key;