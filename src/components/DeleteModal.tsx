import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export type DeleteModalProps = {
  hide: boolean;
  onClose: () => void;
  onDelete: () => void;
  name: string;
};

const DeleteModalComponent = ({
  name,
  onDelete,
  hide,
  onClose
}: DeleteModalProps) => {
  return (
    <Modal
      show={!hide}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete <span className="text-primary">{name}</span>?
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const DeleteModal = DeleteModalComponent;
