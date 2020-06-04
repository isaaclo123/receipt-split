import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { LoginData, LoginState } from "../types/index";

import { LinkContainer } from "react-router-bootstrap";

import "./Login.css";

import { Redirect } from "react-router-dom";

import { setLogin, setToken } from "../actions/index";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/Form";

import { RootState } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { loginState } = state;
  return {
    loginState
  };
};

const connector = connect(
  mapStateToProps,
  { setLogin, setToken }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  loginState: LoginState;
};

const LoginPage = ({ loginState, setLogin, setToken }: Props) => {
  // Set token if already in localstorage
  setToken();

  const { login }: LoginData = loginState.data;

  console.log("LOGIN");
  if (login) {
    return <Redirect to={"/app"} />;
  }

  let loginData = {
    username: "",
    password: ""
  };

  const handleLoginClick = () => {
    setLogin(loginData);
  };

  const handleKeyPress = (event: React.KeyboardEvent<FormControl & HTMLInputElement>) => {
    if (event.key === "Enter") {
      setLogin(loginData);
    }
  };

  return (
    <div className="login-container">
      <Card>
        <Card.Body>
          <Card.Title>Login</Card.Title>

          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="email"
                placeholder="Username"
                onChange={(event: React.ChangeEvent<FormControl & HTMLInputElement>) => {
                  loginData = Object.assign({}, loginData, {
                    username: event.currentTarget.value
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onKeyPress={handleKeyPress}
                onChange={(event: React.ChangeEvent<FormControl & HTMLInputElement>) => {
                  loginData = Object.assign({}, loginData, {
                    password: event.currentTarget.value
                  });
                }}
              />
            </Form.Group>

            <span>
              <Button onClick={handleLoginClick} className="float-left">
                Login
              </Button>

              <LinkContainer to={`/signup`} className="float-right">
                <Button>Signup</Button>
              </LinkContainer>
            </span>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export const Login = connector(LoginPage);
