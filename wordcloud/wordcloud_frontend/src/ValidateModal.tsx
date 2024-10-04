import Modal from "./components/Modal";

type ValidateModalProps = {
  onClose: () => void;
  word: string;
  onApprove: () => void;
  onReject: () => void;
}

function ValidateModal({onClose, word, onApprove, onReject}: ValidateModalProps) {
  return (
    <Modal isOpen onClose={onClose}>
      <p>Approve or reject</p>
      <p> "{word}"?</p>
      <div className="buttons">
        <button className="approve" onClick={onApprove}>Approve</button>
        <button className="reject" onClick={onReject}>Reject</button>
      </div>
    </Modal>
  )
}

export default ValidateModal;