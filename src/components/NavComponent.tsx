import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { RouteComponentProps } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";

import { deleteToken, getUser } from "../actions/index";
import { RootState } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { userState } = state;
  return { userState };
};

const connector = connect(
  mapStateToProps,
  { deleteToken, getUser }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps<{}>;

const NavComponentPage = ({ match, deleteToken, getUser, userState }: Props) => {
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
            <Nav.Link>Balances</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/receipts`}>
            <Nav.Link>Receipts</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/people`}>
            <Nav.Link>People</Nav.Link>
          </LinkContainer>

        <NavDropdown title={fullname} alignRight id="basic-nav-dropdown">
          <NavDropdown.Item onClick={deleteToken}>Log Out</NavDropdown.Item>
        </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export const NavComponent = connector(NavComponentPage);
