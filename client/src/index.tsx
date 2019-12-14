import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import {
  BrowserRouter,
  Redirect,
  Route
} from 'react-router-dom';

import configureStore from './store';
import './index.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';

import * as serviceWorker from './serviceWorker';

import App from './components/App';
import Login from './components/LoginPage';
import Signup from './components/SignupPage';
import PrivateRoute from './components/PrivateRoute'

ReactDOM.render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <PrivateRoute exact path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <PrivateRoute path="/app" component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
