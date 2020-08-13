import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState, LoginState } from "../types/index";

import { Route, Redirect, RouteProps } from "react-router-dom";

const mapStateToProps = (state: RootState) => {
  const { loginState } = state;
  return {
    loginState
  };
};

const connector = connect(
  mapStateToProps,
  {}
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteProps & {
    loginState: LoginState;

    onSuccess?: () => void;
    onFail?: () => void;
  };

const PrivateRouteComponent = (props: Props) => {
  console.log(props);

  const {
    onSuccess = () => {},
    onFail = () => {}
  } = props;

  const { login } = props.loginState.data;

  if (!login) {
    onFail()
    return <Redirect to="/login" />;
  }

  const { loginState, ...rest } = props;

  onSuccess()

  return <Route {...rest} />;
};

export const PrivateRoute = connector(PrivateRouteComponent);
