import React from 'react'

import { connect, ConnectedProps } from 'react-redux'

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

import { getRecieptList, getReciept } from '../actions/getReciept'

import './App.css'

const connector = connect(
  null,
  { getReciept, getRecieptList }
)


type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & RouteComponentProps<{}>

const App = (props: Props) => {
  const { match, getReciept, getRecieptList } = props

  return (
    <>
      <NavComponent {...props}/>

      <div className="container pt-3 h-100">
        <Switch>
          <PrivateRoute path={`${match.path}/balance`} component={BalancePage} />

          <PrivateRoute
            path={`${match.path}/reciepts/list`}

            render={() => {
              getRecieptList()
              return <Redirect to={`${match.path}/reciepts`}/>
            }} />

          <PrivateRoute path={`${match.path}/reciepts/edit`}
            render={props => <RecieptEditPage {...props}/>} />

          <PrivateRoute
            path={`${match.path}/reciepts/:id`}
            render={(props) => {
              getReciept({id: props.match.params.id})
              return <Redirect to={`${match.path}/reciepts/edit`}/>
            }} />

          <PrivateRoute path={`${match.path}/reciepts`} component={RecieptPage} />

          <PrivateRoute path={`${match.path}/people`} component={PeoplePage} />

          <Redirect to={`${match.url}/balance`} />
        </Switch>
      </div>
    </>
  )
}

export default connector(App)
