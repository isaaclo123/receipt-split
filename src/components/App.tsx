import React from "react";

import { connect, ConnectedProps } from "react-redux";

import { Switch, RouteComponentProps, Redirect } from "react-router-dom";

import {
  PrivateRoute,
  NavComponent,
  BalancePage,
  ReceiptPage,
  PeoplePage,
  ReceiptEditPage
} from "./index";

import "./App.css";

import { startApiFetcher } from "../api/index";

const connector = connect(
  null,
  {}
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & RouteComponentProps<{}>;

const AppComponent = (props: Props) => {
  const {
    match,
  } = props;

  startApiFetcher();

  return (
    <>
      <NavComponent {...props} />
      <div className="container pt-3 h-100">
        <Switch>
          <PrivateRoute
            path={`${match.url}/balance`}
            component={BalancePage}
          />
          <PrivateRoute
            path={`${match.url}/receipts/edit/:id`}
            component={ReceiptEditPage}
          />
          <PrivateRoute
            path={`${match.url}/receipts`}
            component={ReceiptPage}
          />

          <PrivateRoute path={`${match.url}/people`}
            component={PeoplePage}
          />

          <Redirect to={`${match.url}/balance`} />
        </Switch>
      </div>
    </>
  );
};

export const App = connector(AppComponent);
