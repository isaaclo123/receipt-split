import React from "react";

import { connect, ConnectedProps } from "react-redux";

import { Switch, RouteComponentProps } from "react-router-dom";

import { PrivateRoute, NavComponent, RecieptPage, PeoplePage } from "./index";

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
            path={`${match.path}/reciepts`}
            component={RecieptPage}
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
//           <PrivateRoute path={`${match.path}/reciepts/edit/:id`} component={RecieptEditPage} />
//
//           <PrivateRoute path={`${match.path}/reciepts`} component={RecieptPage} />
//
//           <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />
//
//           <Redirect to={`${match.url}/balance`} />
//         </Switch>

// <PrivateRoute path={`${match.path}/reciepts/edit/:id`} component={RecieptEditPage} />
// <PrivateRoute path={`${match.path}/reciepts/edit/:id`}
//   render={props => <RecieptEditPage {...props}/>} />

// <PrivateRoute
//   path={`${match.path}/reciepts/edit/:id`}
//   render={(props) => {
//     getReciept({id: props.match.params.id})
//     return <Redirect to={`${match.path}/reciepts/edit`}/>
//   }} />
// <PrivateRoute
//   path={`${match.path}/reciepts/list`}

//   render={() => {
//     getRecieptList()
//     return <Redirect to={`${match.path}/reciepts`}/>
//   }} />

export const App = connector(AppComponent);
