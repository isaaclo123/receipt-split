import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { RouteComponentProps } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";

import { logOut, getUser } from "../actions/index";
import { RootState } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const {
    userState,
    friendState,
    paymentListState,
  } = state;

  return {
    userState,
    friendState,
    paymentListState,
  };
};

const connector = connect(
  mapStateToProps,
  { getUser, logOut }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps<{}>;

const getLengthBadge = (lists: Array<Array<any>>) => {
  const total = lists.reduce((acc: number, cur: Array<any>) => {
    return acc + cur.length;
  }, 0);

  if (total === 0) {
    return null;
  }

  return (
    <span>
      <sup>
        &nbsp;({total})
      </sup>
    </span>
  );
}

const NavComponentPage = ({
  match,
  logOut,
  getUser,
  userState,
  friendState,
  paymentListState,
}: Props) => {
  const [run, setRun] = useState(true);

  if (run) {
    getUser();
    setRun(false);
  }

  const { fullname } = userState.data;

  return (
    <Navbar variant="dark" bg="dark">
      <Navbar.Brand>Receipt Split App</Navbar.Brand>

      <Navbar.Collapse>
        <Nav className="mr-auto" />

        <Nav>
          <LinkContainer to={`${match.url}/balances`}>
            <Nav.Link>
              Balances
              {getLengthBadge([
                paymentListState.data.payments_received,
                paymentListState.data.payments_sent
              ])}
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/receipts`}>
            <Nav.Link>Receipts</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/people`}>
            <Nav.Link>
              People
              {getLengthBadge([
                friendState.data.friends_received,
                friendState.data.friends_sent
              ])}
            </Nav.Link>
          </LinkContainer>

        <NavDropdown title={fullname} alignRight id="basic-nav-dropdown">
          <LinkContainer to={"/login"}>
            <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
          </LinkContainer>
        </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export const NavComponent = connector(NavComponentPage);
