import { ReactNode, useEffect, useRef, useState } from 'react';
import './Key.css';
import { HOLD_DURATION } from '../constants/constants';

type KeyProps = {
  keystroke: string;
  subdiv?: number[];
  text?: boolean;
  handleKeySelect: (key: string, num: number) => void;
  children: ReactNode;
}


function Key({keystroke, subdiv, text, handleKeySelect, children}: KeyProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDown = (e?: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) e.preventDefault();
    // keypress event
    holdTimerRef.current = setTimeout(() => {
      // hold event
      if (keystroke !== 'n') {
        setIsHolding(true);
        setShowModal(true);
      }
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

  const handleSubmit = () => {
    const value = inputRef.current?.value;
    const num = value ? Number(value) : 0; // Convert to number
    console.log('entered', num);

    if (Number.isInteger(num) && num > 0) {
      handleKeySelect(keystroke, num);
      closeModal();
    }
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
        {!text && <>
          {children}
          </>}
        {text && <span className="keytext">{children}</span>}
        {subdiv && <span className="subdiv">{subdiv.join(' + ')}</span>}
      </button>

      {showModal && (
        <dialog ref={dialogRef}>
          <h2>Measures of <span>{children}</span></h2>
          <input ref={inputRef} type="number" min={0} step={1} placeholder="Enter something" />
          <button className="submit" type="submit" onClick={handleSubmit}>Submit</button>
          <button className="close" type="button" onClick={closeModal}>X</button>
        </dialog>
      )}
    </>
  );
};

export default Key;