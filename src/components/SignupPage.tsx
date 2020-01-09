import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { LoginState } from "../types/index";

import "./Login.css";

import { Redirect } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";

import { setSignup } from "../actions/index";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { LoginData, SignupPayload, RootState } from "../types/index";

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  loginState: LoginState;
};

const mapStateToProps = (state: RootState) => {
  const { loginState } = state;
  return {
    loginState
  };
};

const connector = connect(
  mapStateToProps,
  { setSignup }
);

const SignupPage = ({ setSignup, loginState }: Props) => {
  const { login }: LoginData = loginState.data;

  if (login) {
    return <Redirect to={"/app"} />;
  }

  let signupData: SignupPayload = {
    username: "",
    password: "",
    fullname: ""
  };

  const handleSignupClick = () => {
    console.log(signupData);
    setSignup(signupData);
  };

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
                  signupData = Object.assign({}, signupData, {
                    username: event.currentTarget.value
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  signupData = Object.assign({}, signupData, {
                    fullname: event.currentTarget.value
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  signupData = Object.assign({}, signupData, {
                    password: event.currentTarget.value
                  });
                }}
              />
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
  );
};

export const Signup = connector(SignupPage);
