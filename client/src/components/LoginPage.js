import React from 'react'
import { connect } from 'react-redux'

import {
  Redirect
} from 'react-router-dom'

import { setLogin } from '../actions/setLogin'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const defaultRoute = "/app";

const Login = ({ login, setLogin }) => {
  if (login === true) {
    return <Redirect to={defaultRoute} />
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Login</Card.Title>

        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button onClick={setLogin} type="submit">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

const mapStateToProps = ({ login }) => {
  return { login };
}

export default connect(
  mapStateToProps,
  { setLogin }
)(Login)
