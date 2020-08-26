import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route } from "react-router-dom";

import store from "./store";
import "./index.css";
import "./custom.scss";

import * as serviceWorker from "./serviceWorker";

import { App, Login, Signup } from "./components/index";

export const Index = () => (
  <Provider store={store}>
    <HashRouter>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/app" component={App} />
      <Route exact path="/">
        <Redirect to="/app" />
      </Route>
    </HashRouter>
  </Provider>
);

// window.apiFetcher = null;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

ReactDOM.render(
  <Index />,
  document.getElementById("root") || document.createElement('div')
);
