import React from 'react'
import { connect } from 'react-redux'

import {
  Route,
  Redirect
} from 'react-router-dom'

const PrivateRoute = (props) => {
  if (props.login === false) {
    return <Redirect to='/login' />
  }

  return <Route {...props} />
}

const mapStateToProps = ({ login }) => {
  return { login };
}

export default connect(
  mapStateToProps,
  null
)(PrivateRoute)
