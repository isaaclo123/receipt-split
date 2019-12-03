import React from 'react'
import { connect } from 'react-redux'

import {
  Route,
  Link,
  Redirect
} from 'react-router-dom'

// import { setLogin } from '../actions/setLogin'

class Login extends React.Component {
  render() {
    if (this.props.login === false) {
      return <Redirect to='/login' />
    }

    return (
      <div>
        Home!
      </div>
    )
  }
}

export default connect(
  null,
  { }
)(Login)
