import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import {
  UserListItemComponent,
  ListOrNoneComponent,
  userListDiff
} from "./index";
import { getUserAndFriends } from "../actions/index";
import { UserType, RootState } from "../types/index";

export interface UserSelectProps {
  show: boolean;
  title: string;
  onHide: () => void;
  users: UserType[];
  onSelect: (arg0: UserType) => void;
  allUsers: UserType[];
}

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & UserSelectProps;

const connector = connect(
  null,
  { getUserAndFriends }
);

export const UserSelectModalComponent = ({
  show,
  onHide,
  users,
  title,
  onSelect,
  getUserAndFriends,
  allUsers
}: Props) => {
  // gets user info once
  const [run, setRun] = useState(true);

  if (run) {
    getUserAndFriends();
    setRun(false);
  }

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
          list={userListDiff(allUsers, users)}
          noneComponent={<UserListItemComponent />}
          listComponent={(user: UserType) => (
            <UserListItemComponent
              user={user}
              onClick={() => {
                onSelect(user);
                onHide();
              }}
            />
          )}
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
