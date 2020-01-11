import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import { getUser, getFriends } from "../actions/index";
import {
  UserListItemComponent,
  ListOrNoneComponent,
  FriendModal
} from "./index";
import { RootState, FriendState, UserType, UserState } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { userState, friendState } = state;
  return { userState, friendState };
};

const connector = connect(
  mapStateToProps,
  { getUser, getFriends }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteComponentProps<{}> & {
    userState: UserState;
    friendState: FriendState;
  };

const PeoplePageComponent = ({
  match,
  userState,
  friendState,
  getUser,
  getFriends
}: Props) => {
  const [hide, setHide] = useState(true);
  const [run, setRun] = useState(true);

  // const onClose = () => {
  //   setError("");
  //   // setHide(true);
  // };

  // gets user info once
  if (run) {
    getFriends();
    getUser();
    console.log(friendState);
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
          list={friendState.data}
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
