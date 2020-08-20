import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { useLocation, BrowserRouter, HashRouter, Redirect, Route } from "react-router-dom";

import { createBrowserHistory } from "history";

import store from "./store";
import "./index.css";

// import 'bootstrap/dist/css/bootstrap.min.css';
import "./custom.scss";

import * as serviceWorker from "./serviceWorker";

import { App, Login, Signup, PrivateRoute } from "./components/index";

export const Index = () => (
  <Provider store={store}>
    <HashRouter>
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route exact path="/" component={App} />
      <Route path="/app" component={App} />
    </HashRouter>
  </Provider>
);

// window.apiFetcher = null;

ReactDOM.render(
  <Index />,
  document.getElementById("root") || document.createElement('div')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
