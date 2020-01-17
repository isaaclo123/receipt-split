import React from "react";

import { connect, ConnectedProps } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { ListOrNoneComponent, userListDiff } from "./index";
import { UserType, RootState } from "../types/index";

export interface UserSelectProps {
  show: boolean;
  title: string;
  onHide: () => void;
  users: UserType[];
  onUserSelect: (arg0: UserType) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  UserSelectProps & {
    userAndFriends: UserType[];
  };

const mapStateToProps = ({ friendState, userState }: RootState) => {
  return {
    userAndFriends: [userState.data].concat(friendState.data)
  };
};

const connector = connect(
  mapStateToProps,
  {}
);

export const UserSelectModalComponent = ({
  show,
  onHide,
  users,
  title,
  onUserSelect,
  userAndFriends
}: Props) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        style={{
          borderBottom: 0
        }}
      >
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <ListGroup>
        <ListOrNoneComponent<UserType>
          list={userListDiff(userAndFriends, users)}
          noneComponent={
            <ListGroup.Item>
              <span className="text-secondary">None</span>
            </ListGroup.Item>
          }
          listComponent={(user: UserType) => {
            const { username, fullname } = user;
            return (
              <ListGroup.Item
                onClick={() => {
                  onUserSelect(user);
                  onHide();
                }}
              >
                <span className="float-left">{fullname}</span>
                <span className="float-right">({username})</span>
              </ListGroup.Item>
            );
          }}
        />
      </ListGroup>
      <Modal.Footer
        style={{
          borderTop: 0
        }}
      >
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const UserSelectModal = connector(UserSelectModalComponent);
