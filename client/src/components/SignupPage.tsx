import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LoginState, SignupState, SignupData } from '../types/index'

import './Login.css'

import {
  Redirect
} from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import { setSignup } from '../actions/setSignup'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

type PropsFromRedux = ConnectedProps<typeof connector>

type AppState = {
  loginState: LoginState
  signupState: SignupState
}

type Props = PropsFromRedux & AppState

const mapStateToProps = (state: AppState) => {
  const { loginState, signupState } = state
  return {
    loginState,
    signupState
  }
}

const connector = connect(
  mapStateToProps,
  { setSignup }
)

const SignupPage = ({ signupState, setSignup, loginState }: Props) => {
  const { login }: LoginState = loginState;

  if (login) {
    return <Redirect to={'/app'} />
  }

  let signupData: SignupData = {
    username: "",
    password: "",
    fullname: ""
  }

  const handleSignupClick = () => {
    console.log(signupData)
    setSignup(signupData)
  }

  return (
    <div className="login-container">
      <Card>
        <Card.Body>
          <Card.Title>Signup</Card.Title>

          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="email"
                placeholder="Username"
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  signupData = {
                    username: event.currentTarget.value,
                    fullname: signupData.fullname,
                    password: signupData.password
                  }
                }} />
            </Form.Group>

            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  signupData = {
                    username: event.currentTarget.value,
                    fullname: signupData.fullname,
                    password: signupData.password
                  }
                }} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  signupData = {
                    username: signupData.username,
                    fullname: signupData.fullname,
                    password: event.currentTarget.value
                  }
                }} />
            </Form.Group>

            <span>
              <LinkContainer to={`/login`} className="float-left">
                <Button>Login</Button>
              </LinkContainer>

              <Button onClick={handleSignupClick} className="float-right">
                Signup
              </Button>

            </span>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default connector(SignupPage)
