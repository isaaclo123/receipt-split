import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LoginState } from '../reducers/loginReducer'

import {
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom'

type PropsFromRedux = ConnectedProps<typeof connector>
// The inferred type will look like:
// {On: boolean, toggleOn: () => void}

type Props = PropsFromRedux & RouteProps

const PrivateRoute = (props: Props) => {
  if (props.login === false) {
    return <Redirect to='/login' />
  }

  return <Route {...props} />
  // return <Route path={props.path} component={props.component} />

}

const mapStateToProps = ({ username, login }: LoginState) => {
  return { username, login };
}

// const mapDispatch = {
//   toggleOn: () => ({ type: 'TOGGLE_IS_ON' })
// }

const connector = connect(
  mapStateToProps,
  {}
)

export default connector(PrivateRoute)
