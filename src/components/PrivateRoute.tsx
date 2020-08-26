import React from "react";

import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";
import { getToken } from "../api";

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

  onSuccess()
  return <Route {...props} />;
};

// export const PrivateRoute = connector(PrivateRouteComponent);
export const PrivateRoute = PrivateRouteComponent;
