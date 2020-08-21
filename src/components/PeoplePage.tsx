import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import { getUserAndFriends, setFriendConfirm } from "../actions/index";
import {
  UserListItemComponent,
  ListOrNoneComponent,
  FriendModal,
  AcceptRejectComponent,
  AcceptRejectButtonsType
} from "./index";
import { RootState, UserType, FriendType, PEOPLE_PAGE } from "../types/index";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { apiArchive } from "../api/index";

const mapStateToProps = (state: RootState) => {
  const { userState, friendState } = state;
  return { userState, friendState };
};

const connector = connect(
  mapStateToProps,
  {
    getUserAndFriends,
    setFriendConfirm,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps<{}>;

const PeoplePageComponent = ({
  match,
  userState,
  friendState,
  setFriendConfirm,
  getUserAndFriends
}: Props) => {
  const [hide, setHide] = useState(true);

  apiArchive(PEOPLE_PAGE);

  // // gets user info once
  // const [run, setRun] = useState(true);

  // if (run) {
  //   getUserAndFriends();
  //   setRun(false);
  // }

  const errors = (friendState.errors != null) ? friendState.errors : {};

  const { username, fullname } = userState.data;

  const {
    friends,
    friends_received,
    friends_sent
  } = friendState.data;

  console.log("friendState")
  console.log(friendState)
  console.log("friendState")

  return (
    <>
      <FriendModal
        hide={hide}
        onClose={() => {
          setHide(true);
        }}
      />

      {("error" in errors) &&
        <Alert variant="danger">
          {errors.error}
        </Alert>}

      {((friends_received).length > 0) &&
      <>
        <h5>Received Friend Requests</h5>

        <ListGroup className="mb-3">
          {friends_received.map(({
            id = -1,
            accepted,
            from_user = {
              id:-1,
              username:"",
              fullname:"",
            },
          }: FriendType,
          index: number) => {
            return (
              <AcceptRejectComponent
                accepted={accepted}
                buttons={["accept", "reject"]}
                onAccept={() => {
                  setFriendConfirm(id, "accept", index);
                }}
                onReject={() => {
                  setFriendConfirm(id, "reject", index);
                }}
                messageComponent={(
                  <>
                    <span className="text-primary">{from_user.fullname}</span>
                  </>
                  )}
              / >
            );
        })}
        </ListGroup>
      </>}

      {(friends_sent.length > 0) &&
      <>
        <h5>Pending Friend Requests</h5>

        <ListGroup className="mb-3">
          {friends_sent.map(({
            id = -1,
            accepted,
            to_user = {
              id:-1,
              username:"",
              fullname:"",
            },
          }: FriendType) => {
            const buttonType: AcceptRejectButtonsType = (
              (accepted === true && ["accept"]) ||
              (accepted === false && ["reject"]) ||
              (["pending"])
            );

            return (
              <AcceptRejectComponent
                accepted={accepted}
                buttons={buttonType}
                messageComponent={(
                  <>
                    <span className="text-primary">{to_user.fullname}</span>
                  </>
                  )}
              / >
            );
          })}
        </ListGroup>
      </>
      }

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
        <Button
          variant="link"
          className="m-0 p-0 float-right"
          onClick={() => setHide(false)}
          >
          + Add Friends
        </Button>
      </div>
      <br />
      <h5 />

      <ListGroup className="mb-3">
        <ListOrNoneComponent<UserType>
          list={friends}
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
