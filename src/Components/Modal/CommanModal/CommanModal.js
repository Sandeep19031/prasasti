import Modal from "react-bootstrap/Modal";
import "./CommanModal.scss";

const CommanModal = ({ show, handleClose, title, children }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="common-modal">
      <Modal.Header closeButton={handleClose}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CommanModal;
