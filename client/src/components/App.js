import React from 'react'

import {
  Route,
  Switch,
  Link
} from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import PrivateRoute from './PrivateRoute'
import NavComponent from './NavComponent'

import BalancePage from './BalancePage'
import RecieptPage from './RecieptPage'
import PeoplePage from './PeoplePage'
import NotificationPage from './NotificationPage'

const App = ({ match }) => {
  return (
    <>
      <NavComponent match={ match } />

      <div class="container">
        <Switch>
          <PrivateRoute path={`${match.path}/balance`} component={BalancePage} exact />
          <PrivateRoute path={`${match.path}/reciepts`} component={RecieptPage} />
          <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />
          <PrivateRoute path={`${match.path}/notifications`} component={NotificationPage} />
          <PrivateRoute component={BalancePage} />
        </Switch>
      </div>
    </>
  )
}

export default App
