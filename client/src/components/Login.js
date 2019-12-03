import React from 'react'
import { connect } from 'react-redux'

import {
  Route,
  Link,
  Redirect
} from 'react-router-dom'

import { setLogin } from '../actions/setLogin'

class Login extends React.Component {
  handleSetLogin = () => {
    console.log(this.props.login)
    this.props.setLogin()
  }

  render() {
    if (this.props.login === true) {
      return <Redirect to='/home' />
    }

    return (
      <div>
        Login

        <p>{ this.props.login.toString() }</p>
        <button onClick={this.handleSetLogin}>
          Login
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { login } = state
  console.log("login");
  console.log(state);

  return {
    login
  };
}

export default connect(
  mapStateToProps,
  { setLogin }
)(Login)
