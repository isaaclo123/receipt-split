import React from "react";

import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";
import { getToken } from "../api";
import { startApiFetcher } from "../api/index";

type Props = RouteProps & {
  // loginState: LoginState;

  onSuccess?: () => void;
  onFail?: () => void;
};

const PrivateRouteComponent = (props: Props) => {
  const location = useLocation();

  console.log(props);

  const {
    onSuccess = () => {},
    onFail = () => {}
  } = props;

  const token = getToken();

  if (token == null) {
    onFail()

    return <Redirect to={{
      pathname: "/login",
      state: {
        referrer: location.pathname
      }
    }} />;
  }

  onSuccess();
  startApiFetcher();
  return <Route {...props} />;
};

export const PrivateRoute = PrivateRouteComponent;
