import React from 'react'

import {
  Redirect,
  Switch,
  RouteComponentProps
} from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import NavComponent from './NavComponent'

import BalancePage from './BalancePage'
import RecieptPage from './RecieptPage'
import RecieptEditPage from './RecieptEditPage'
import PeoplePage from './PeoplePage'

const App = (props: RouteComponentProps<{}>) => {
  const { match } = props

  return (
    <>
      <NavComponent {...props}/>

      <div className="container pt-3 h-100">
        <Switch>
          <PrivateRoute path={`${match.path}/balance`} component={BalancePage} />

          <PrivateRoute
            path={`${match.path}/reciepts/:id`}
            render={props => <RecieptEditPage {...props}/>} exact />

          <PrivateRoute path={`${match.path}/reciepts`} component={RecieptPage} />

          <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />

          <Redirect to={`${match.url}/balance`} />
        </Switch>
      </div>
    </>
  )
}
          // <PrivateRoute component={redirect(propsr} exact />

export default App
