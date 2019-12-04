import React from 'react'

import {
  Switch,
  RouteComponentProps
} from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import NavComponent from './NavComponent'

import BalancePage from './BalancePage'
import RecieptPage from './RecieptPage'
import PeoplePage from './PeoplePage'
import NotificationPage from './NotificationPage'


const App = (props: RouteComponentProps<{}>) => {
  const { match } = props
  console.log(props)

  return (
    <>
      <NavComponent {...props}/>

      <div className="container">
        <Switch>
          <PrivateRoute path={`${match.path}/balance`} component={BalancePage} exact />
          <PrivateRoute path={`${match.path}/reciepts`} component={RecieptPage} />
          <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />
          <PrivateRoute path={`${match.path}/notifications`} component={NotificationPage} />
          <PrivateRoute component={BalancePage} exact />
        </Switch>
      </div>
    </>
  )
}

export default App
