import React from "react";

import { ListGroupItemProps } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

import { UserType } from "../types/index";

// export interface UserListItemProps extends ListGroup {
//   user?: UserType | null;
// }
type UserListItemProps = ListGroupItemProps & {
  user?: UserType | null;
  onClick?: () => void;
};

export const UserListItemComponent = (props: UserListItemProps) => {
  const { user = null, ...rest } = props;

  if (user == null) {
    return (
      <ListGroup.Item {...rest}>
        <span className="text-secondary">None</span>
      </ListGroup.Item>
    );
  }

  const { fullname, username } = user;

  return (
    <ListGroup.Item {...rest}>
      <span className="float-left">
        <span className="text-primary">{fullname}</span>
      </span>
      <span className="float-right">({username})</span>
    </ListGroup.Item>
  );
};
