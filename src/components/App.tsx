import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";

import { Switch, RouteComponentProps, Redirect } from "react-router-dom";

import {
  getPaymentListAndBalances,
  getReceiptList,
  getUserAndFriends,
} from "../actions/index";

import {
  PrivateRoute,
  NavComponent,
  BalancePage,
  ReceiptPage,
  PeoplePage,
  ReceiptEditPage
} from "./index";

import "./App.css";

import { API_FETCH_INTERVAL } from "../api/index";

const connector = connect(
  null,
  {
    getPaymentListAndBalances,
    getReceiptList,
    getUserAndFriends,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & RouteComponentProps<{}>;

const AppComponent = (props: Props) => {
  const [apiFetcher, setApiFetcher] = useState(-1);
  const [run, setRun] = useState(true);

  const {
    match,

    getPaymentListAndBalances,
    getReceiptList,
    getUserAndFriends,
  } = props;

  const startApiFetcher = () => {
    console.log("start api");

    // TODO not sure if id is possibly negative
    if (!run) {
      return;
      // clearInterval(apiFetcher)
    }

    const interval = setInterval(() => {
      console.log("interval fetch")

      getPaymentListAndBalances(false);
      getReceiptList();
      getUserAndFriends(false);
    }, API_FETCH_INTERVAL);

    setApiFetcher(interval as any);
    setRun(false);
  }

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
