import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { LoginState } from "../types/index";

import { LinkContainer } from "react-router-bootstrap";

import "./Login.css";

import { Redirect, RouteProps } from "react-router-dom";

import { setLogin } from "../actions/index";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/Form";

import { LocationState, RootState } from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { loginState } = state;
  return {
    loginState
  };
};

const connector = connect(
  mapStateToProps,
  { setLogin }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteProps & {
  loginState: LoginState;
};

const LoginPage = (props: Props) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const location  = useLocation<LocationState>();

  const { referrer } = location.state || { referrer: "/app" };

  const { loginState, setLogin } = props;

  if (loginState.data.login) {
    return <Redirect to={referrer} />;
  }

  const errors = (loginState.errors != null) ? loginState.errors : {};

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

          { ("error" in errors) ?
            <Alert variant="danger">
              Unable to Log In!
            </Alert>
          : <></>}

          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="email"
                placeholder="Username"
                onChange={(event: React.ChangeEvent<FormControl & HTMLInputElement>) => {
                  setLoginData(Object.assign({}, loginData, {
                    username: event.currentTarget.value
                  }));
                }}
                isInvalid={"username" in errors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onKeyPress={handleKeyPress}
                onChange={(event: React.ChangeEvent<FormControl & HTMLInputElement>) => {
                  setLoginData(Object.assign({}, loginData, {
                    password: event.currentTarget.value
                  }));
                }}
                isInvalid={"password" in errors}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
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
