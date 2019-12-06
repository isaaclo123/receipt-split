import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LoginState } from '../reducers/loginReducer'

import {
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom'

const mapStateToProps = (state: LoginState) => {
  return state
}

const connector = connect(
  mapStateToProps,
  {}
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteProps & {
  loginState?: LoginState
}

const PrivateRoute = (props: Props) => {
  console.log(props)

  if (props.loginState == null || props.loginState.login === false) {
    return <Redirect to='/login' />
  }

  const { loginState, ...rest } = props

  return <Route {...rest}/>
}

export default connector(PrivateRoute)
