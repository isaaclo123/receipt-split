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

import { apiArchive } from "../api/index";
import { RECEIPT_PAGE, PEOPLE_PAGE, BALANCE_PAGE } from "../types";

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
            path={`${match.url}/balance`}
            component={BalancePage}
            onSuccess={() => {
              apiArchive(BALANCE_PAGE);
            }}
          />
          <PrivateRoute
            path={`${match.url}/receipts/edit/:id`}
            component={ReceiptEditPage}
          />
          <PrivateRoute
            path={`${match.url}/receipts`}
            component={ReceiptPage}
            onSuccess={() => {
              apiArchive(RECEIPT_PAGE);
            }}
          />

          <PrivateRoute path={`${match.url}/people`}
            component={PeoplePage}
            onSuccess={() => {
              // startApiFetcher in PrivateRoute
              apiArchive(PEOPLE_PAGE);
            }}
          />

          <Redirect to={`${match.url}/balance`} />
        </Switch>
      </div>
    </>
  );
};

export const App = connector(AppComponent);
