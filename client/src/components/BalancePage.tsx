import React, {useState} from 'react'

import { connect, ConnectedProps } from 'react-redux'
import { useHistory } from "react-router-dom";

import { addUser } from '../api/index';

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { getUser } from '../actions/getUser'
import { BalanceType, UserType, UserState, LoginState } from '../types/index'

import { TakeProps, TakeListItemComponent } from './TakeListItemComponent'
import { LeaveProps, LeaveListItemComponent } from './LeaveListItemComponent'

const mapStateToProps = (state: any) => {
  return state
}

const connector = connect(
  mapStateToProps,
  { getUser }
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<{}> & {
  userState?: UserState
  loginState?: LoginState
}

const BalancePage = ({match, userState, getUser, loginState}: Props) => {
  const [ run, setRun ] = useState(true)
  // gets user info once
  if (run) {
    setRun(false)
    getUser()
  }

  if (userState == null) {
    return <Redirect to={'/app'} />
  }

  const { user } = userState

  if (user == null) {
    return (<div>loading</div>)
  }

  const { friends, username, fullname, balances_to_user, balances_from_user } = user

  return (
    <>
      <h5>You are Owed</h5>

      <ListGroup className="mb-3">

      {(balances_to_user == null || balances_to_user.length <= 0) &&
        (<ListGroup.Item>
          <span className="text-secondary">
            None
          </span>
        </ListGroup.Item>)
      }

      {balances_to_user.map(({
          amount,
          from_user
        }: BalanceType) => {
          if (from_user.id != null && from_user.id == userState.user.id) {
            return (<></>)
          }

          const props: TakeProps = {
            handleNameClick: () => {},
            handleAcceptClick: () => {},
            handleRejectClick: () => {},
            amount,
            name: (from_user.fullname == null) ? "Unknown" : from_user.fullname,
            pending: true,
          }
          return (
            <TakeListItemComponent
              {...props}/>
          )

        })}
      </ListGroup>


      <h5>You Should Pay</h5>

      <ListGroup className="mb-3">

      {(balances_from_user == null || balances_from_user.length <= 0) &&
        (<ListGroup.Item>
          <span className="text-secondary">
            None
          </span>
        </ListGroup.Item>)
      }

      {balances_from_user.map(({
          amount,
          to_user
        }: BalanceType) => {
          if (to_user.id != null && to_user.id == userState.user.id) {
            return (<></>)
          }

          const props: LeaveProps = {
            handleNameClick: () => {},
            handlePayClick: () => {},
            amount,
            name: (to_user.fullname == null) ? "Unknown" : to_user.fullname,
            pending: true,
          }
          return (
            <LeaveListItemComponent
              {...props}/>
          )

        })}
      </ListGroup>
    </>
  )
}

export default connector(BalancePage)
