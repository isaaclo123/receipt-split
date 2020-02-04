import React from "react";

import { connect, ConnectedProps } from "react-redux";

import { Switch, RouteComponentProps } from "react-router-dom";

import {
  PrivateRoute,
  NavComponent,
  ReceiptPage,
  PeoplePage,
  ReceiptEditPage
} from "./index";

import "./App.css";

const connector = connect(
  null,
  {}
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & RouteComponentProps<{}>;

const AppComponent = (props: Props) => {
  const { match } = props;

  return (
    <>
      <NavComponent {...props} />
      <div className="container pt-3 h-100">
        <Switch>
          <PrivateRoute
            path={`${match.path}/receipts/edit/:id`}
            component={ReceiptEditPage}
          />
          <PrivateRoute
            path={`${match.path}/receipts`}
            component={ReceiptPage}
          />

          <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />
        </Switch>
      </div>
    </>
  );
};
//         <Switch>
//           <PrivateRoute path={`${match.path}/balance`} component={BalancePage} />
//
//           <PrivateRoute path={`${match.path}/receipts/edit/:id`} component={ReceiptEditPage} />
//
//           <PrivateRoute path={`${match.path}/receipts`} component={ReceiptPage} />
//
//           <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />
//
//           <Redirect to={`${match.url}/balance`} />
//         </Switch>

// <PrivateRoute path={`${match.path}/receipts/edit/:id`} component={ReceiptEditPage} />
// <PrivateRoute path={`${match.path}/receipts/edit/:id`}
//   render={props => <ReceiptEditPage {...props}/>} />

// <PrivateRoute
//   path={`${match.path}/receipts/edit/:id`}
//   render={(props) => {
//     getReceipt({id: props.match.params.id})
//     return <Redirect to={`${match.path}/receipts/edit`}/>
//   }} />
// <PrivateRoute
//   path={`${match.path}/receipts/list`}

//   render={() => {
//     getReceiptList()
//     return <Redirect to={`${match.path}/receipts`}/>
//   }} />

export const App = connector(AppComponent);
