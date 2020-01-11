import React from "react";

import ListGroup from "react-bootstrap/ListGroup";

import { UserType } from "../types/index";

export type UserListItemProps = {
  user?: UserType | null;
};

export const UserListItemComponent = ({ user = null }: UserListItemProps) => {
  if (user == null) {
    return (
      <ListGroup.Item>
        <span className="text-secondary">None</span>
      </ListGroup.Item>
    );
  }

  const { fullname, username } = user;

  return (
    <ListGroup.Item>
      <span className="float-left">
        <span className="text-primary">{fullname}</span>
      </span>
      <span className="float-right">({username})</span>
    </ListGroup.Item>
  );
};
