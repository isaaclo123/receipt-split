import React from 'react'
import { connect } from 'react-redux'

import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar';
import Login from './Login';
import Home from './Home';

class App extends React.Component {
  handleSetLogin = () => {
    console.log(this.props.login)
    this.props.setLogin()
  }

  render() {
    return (
      <>
        <Navbar>
          <Navbar.Brand>Reciept Split</Navbar.Brand>
        </Navbar>

        <Switch>
          <Route exact path="/" component={Login}/>
          <Route path="/login" component={Login}/>
          <Route exact path="/home" component={Home}/>
        </Switch>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { login } = state

  return {
    login
  };
}

export default App
