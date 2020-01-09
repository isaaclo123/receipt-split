import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { UserType } from '../types/index'

export interface UserSelectProps {
  show: boolean;
  title: string;
  onHide: () => void;
  users: UserType[];
  onUserSelect: (arg0: UserType) => void;
}

export const UserSelectModal = ({
  show,
  onHide,
  users,
  title,
  onUserSelect
}: UserSelectProps) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{
        borderBottom: 0
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
        <ListGroup>
          {(users == null || users.length <= 0) &&
            (<ListGroup.Item>
              <span className="text-secondary">
                None
              </span>
            </ListGroup.Item>)
          }

          {(users != null) && users.map((user: UserType) => {
            const {
              username="",
              fullname="",
              id=-1
            } = user
              return (<ListGroup.Item onClick={() => {onUserSelect(user); onHide()}}>
                <span className="float-left">
                  {fullname}
                </span>
                <span className="float-right">
                  ({username})
                </span>
              </ListGroup.Item>)
          })}
        </ListGroup>
          <Modal.Footer style={{
            borderTop: 0
          }}>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
