import React from 'react'
import { connect } from 'react-redux'

import {
  Route,
  Link,
  Redirect
} from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const NavComponent = ({ match }) => {
  return (
    <Navbar variant="dark" bg="dark">
      <Navbar.Brand>
        Reciept Split
      </Navbar.Brand>

      <Navbar.Collapse>

        <Nav className="mr-auto" />

        <Nav>
          <LinkContainer to={`${match.url}/balances`}>
            <Nav.Link>Balances</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/reciepts`}>
            <Nav.Link>Reciepts</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/people`}>
            <Nav.Link>People</Nav.Link>
          </LinkContainer>

          <LinkContainer to={`${match.url}/notifications`}>
            <Nav.Link>Notifications</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavComponent
