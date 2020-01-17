import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { addFriend } from "../actions/index";

import { FriendState, RootState } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { friendState } = state;
  return { friendState };
};

const connector = connect(
  mapStateToProps,
  { addFriend }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export type FriendModalProps = PropsFromRedux & {
  friendState: FriendState;
} & {
  hide: boolean;
  onClose: () => void;
};

// TODO errors.error
const FriendModalComponent = ({
  friendState,
  addFriend,

  hide,
  onClose
}: FriendModalProps) => {
  console.log(friendState);
  const { error, errors } = friendState;

  const [friendText, setFriendText] = useState("");

  return (
    <Modal
      show={!hide}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Friend</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            aria-describedby="basic-input"
            isInvalid={error}
            value={friendText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFriendText(event.currentTarget.value);
            }}
          />
          <InputGroup.Append>
            <Button
              variant="outline-primary"
              onClick={() => {
                addFriend(friendText);
              }}
            >
              Add
            </Button>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            {"error" in errors ? errors.error : "Unknown Error"}
          </Form.Control.Feedback>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const FriendModal = connector(FriendModalComponent);
