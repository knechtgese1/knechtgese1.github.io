import React, { useRef, useEffect } from 'react';
import Close from "../assets/close-svgrepo-com.svg";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (isOpen && dialogElement) {
      dialogElement.showModal();
    } else {
      dialogElement?.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog className="modal" ref={dialogRef} onClick={handleBackdropClick}>
      <div>
        <button className="close" onClick={onClose}>
          <img src={Close} />
        </button>
          {children}
      </div>
    </dialog>
  );
};

export default Modal;