import React from 'react'

import {
  Route,
  Switch,
  Link
} from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

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
          <Route exact path={`${match.path}/balance`} component={BalancePage} />
          <Route path={`${match.path}/reciepts`} component={RecieptPage} />
          <Route path={`${match.path}/people`} component={PeoplePage} />
          <Route path={`${match.path}/notifications`} component={NotificationPage} />
          <Route component={BalancePage} />
        </Switch>
      </div>
    </>
  )
}

export default App
