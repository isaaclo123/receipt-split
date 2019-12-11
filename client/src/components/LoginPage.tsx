import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LoginState } from '../types/index'

import './Login.css'

import {
  Redirect
} from 'react-router-dom'

import { setLogin } from '../actions/setLogin'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const mapStateToProps = (state: LoginState) => {
  return state
}

const connector = connect(
  mapStateToProps,
  { setLogin }
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  loginState: LoginState
}

const LoginPage = ({ loginState, setLogin }: Props) => {
  const { login }: LoginState = loginState;

  const handleLoginClick = () => {
    setLogin({
      username: "isaac",
      password: "test"
    });
  }

  if (login === true) {
    return <Redirect to={'/app'} />
  }

  return (
    <div className="login-container">
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

            <Button onClick={handleLoginClick}>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default connector(LoginPage)
