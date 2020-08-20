import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState, LoginState } from "../types/index";

import { Route, Redirect, RouteProps, useLocation, useHistory } from "react-router-dom";
import { getToken } from "../api";

// const mapStateToProps = (state: RootState) => {
//   return { };
// };

// const connector = connect(
//   null,
//   {}
// );

// type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteProps & {
    // loginState: LoginState;

    onSuccess?: () => void;
    onFail?: () => void;
  };

const PrivateRouteComponent = (props: Props) => {
  const location = useLocation();
  // const history = useHistory();

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
