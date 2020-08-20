import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { LoginState } from "../types/index";

import "./Login.css";

import { Redirect } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";

import { setSignup } from "../actions/index";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { LoginData, RootState } from "../types/index";

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
  const [signupData, setSignupData] = useState({
    username: "",
    fullname: "",
    password: "",
    confirm: "",
  });

  const { login }: LoginData = loginState.data;

  if (login) {
    return <Redirect to={"/app"} />;
  }

  const errors = (loginState.errors != null) ? loginState.errors : {};

  const handleSignupClick = () => {
    console.log("signupData");
    console.log(signupData);
    setSignup(signupData);
  };

  return (
    <div className="login-container">
      <Card>
        <Card.Body>
          <Card.Title>Signup</Card.Title>

          { ("error" in errors) ?
            <Alert variant="danger">
              {errors.error}
            </Alert>
          : <></>}

          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignupData(Object.assign({}, signupData, {
                    username: event.currentTarget.value
                  }));
                }}
                isInvalid={"username" in errors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignupData(Object.assign({}, signupData, {
                    fullname: event.currentTarget.value
                  }));
                }}
                isInvalid={"fullname" in errors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignupData(Object.assign({}, signupData, {
                    password: event.currentTarget.value
                  }));
                }}
                isInvalid={"password" in errors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignupData(Object.assign({}, signupData, {
                    confirm: event.currentTarget.value
                  }));
                }}
                isInvalid={"confirm" in errors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirm}
              </Form.Control.Feedback>
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
