import React, { useState } from "react";

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

  return (
    <>
      <NavComponent {...props} />
      <div className="container pt-3 h-100">
        <Switch>
          <PrivateRoute
            path={`${match.path}/balance`}
            component={BalancePage}
            onSuccess={startApiFetcher}
          />
          <PrivateRoute
            path={`${match.path}/receipts/edit/:id`}
            component={ReceiptEditPage}
            onSuccess={startApiFetcher}
          />
          <PrivateRoute
            path={`${match.path}/receipts`}
            component={ReceiptPage}
            onSuccess={startApiFetcher}
          />

          <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />

          <Redirect to={`${match.url}/balance`} />
        </Switch>
      </div>
    </>
  );
};

export const App = connector(AppComponent);
