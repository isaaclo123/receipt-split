import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import { getUserAndFriends } from "../actions/index";
import {
  UserListItemComponent,
  ListOrNoneComponent,
  FriendModal
} from "./index";
import { RootState, UserType } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { userState, friendState } = state;
  return { userState, friendState };
};

const connector = connect(
  mapStateToProps,
  { getUserAndFriends }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps<{}>;

const PeoplePageComponent = ({
  match,
  userState,
  friendState,
  getUserAndFriends
}: Props) => {
  const [hide, setHide] = useState(true);

  // gets user info once
  const [run, setRun] = useState(true);

  if (run) {
    getUserAndFriends();
    setRun(false);
  }

  const { username, fullname } = userState.data;

  return (
    <>
      <FriendModal
        hide={hide}
        onClose={() => {
          setHide(true);
        }}
      />
      <h5>User Info</h5>
      <ListGroup className="mb-3">
        <ListGroup.Item>
          <span className="float-left">
            <span className="text-primary">{fullname}</span>
          </span>
          <span className="float-right">({username})</span>
        </ListGroup.Item>
      </ListGroup>
      <div className="align-middle">
        <h5 className="float-left">Friends</h5>
        <span
          className="text-primary float-right"
          onClick={() => setHide(false)}
        >
          + Add Friends
        </span>
      </div>
      <br />
      <h5 />

      <ListGroup className="mb-3">
        <ListOrNoneComponent<UserType>
          list={friendState.data.friends}
          listComponent={(user: UserType) => (
            <UserListItemComponent user={user} />
          )}
          noneComponent={<UserListItemComponent />}
        />
      </ListGroup>
    </>
  );
};

export const PeoplePage = connector(PeoplePageComponent);
