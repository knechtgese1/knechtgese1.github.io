import { useEffect, useRef } from "react";
import Modal from "./Modal";
import "./ValidateModal.css";

type ValidateModalProps = {
  word: string;
  onApprove: () => void;
  onClose: () => void;
  onReject: () => void;
}

function ValidateModal({word, onApprove, onClose, onReject}: ValidateModalProps) {
  const approveButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    approveButton.current?.focus();
  }, [])

  return (
    <Modal isOpen onClose={onClose}>
      <div className="text">
        <p>Approve or reject</p>
        <p> "{word}"?</p>
      </div>
      <div className="buttons">
        <button className="approve" ref={approveButton} onClick={onApprove}>Approve</button>
        <button className="reject" onClick={onReject}>Reject</button>
      </div>
    </Modal>
  )
}

export default ValidateModal;