import { useEffect, useRef } from "react";
import Modal from "./Modal";
import "./RemoveModal.css";

type RemoveModalProps = {
  word: string;
  onClose: () => void;
  onNo: () => void;
  onYes: () => void;
}

function RemoveModal({word, onClose, onNo, onYes}: RemoveModalProps) {
  const approveButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    approveButton.current?.focus();
  }, [])

  return (
    <Modal isOpen onClose={onClose}>
      <div className="text">
        <p>Remove</p>
        <p> "{word}"?</p>
      </div>
      <div className="buttons">
        <button className="yes" ref={approveButton} onClick={onYes}>Yes</button>
        <button className="no" onClick={onNo}>No</button>
      </div>
    </Modal>
  )
}

export default RemoveModal;