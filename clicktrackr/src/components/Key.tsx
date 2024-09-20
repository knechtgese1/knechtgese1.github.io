import { useEffect, useRef, useState } from 'react';
import './Key.css';
import { HOLD_DURATION } from '../constants/constants';

type KeyProps = {
  keystroke: string;
  display: string;
  subdiv?: number[];
  text?: boolean;
  handleKeySelect: (key: string, num: number) => void;
}


function Key({keystroke, display, subdiv, text, handleKeySelect}: KeyProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDown = (e: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // keypress event
    console.log('pressing', keystroke);
    holdTimerRef.current = setTimeout(() => {
      // hold event
      setIsHolding(true);
      setShowModal(true);
    }, HOLD_DURATION);
  };
  const handleUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isHolding) {
      // release event
      setIsHolding(false);
    } else {
      // click event
      handleKeySelect(keystroke, 1);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [showModal]);

  return (
    <>
      <button
        className="keypad-key"
        onMouseDown={(e) => handleDown(e)}
        onMouseUp={handleUp}
        onTouchStart={(e) => handleDown(e)}
        onTouchEnd={handleUp}
      >
        <span className="keystroke">{keystroke}</span>
        {!text && <span>{display}</span>}
        {text && <span className="keytext">{display}</span>}
        {subdiv && <span className="subdiv">{subdiv.join(' + ')}</span>}
      </button>

      {showModal && (
        <dialog ref={dialogRef}>
          <h2>Measures of <span>{display}</span></h2>
          <input type="text" placeholder="Enter something" />
          <button onClick={closeModal}>X</button>
        </dialog>
      )}
    </>
  );
};

export default Key;