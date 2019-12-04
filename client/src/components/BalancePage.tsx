import React from 'react'

import ListGroup from 'react-bootstrap/ListGroup';

import { TakeProps, TakeListItemComponent } from './TakeListItemComponent';
import { LeaveProps, LeaveListItemComponent } from './LeaveListItemComponent';

const youowe = [ // TODO
  {
    name: "bill",
    amount: 5.00,
    pending: true,
  },
  {
    name: "bill2",
    amount: 5.20,
    pending: false,
  },
]

const BalancePage = () => {
  return (
    <>
    <h5>You Take</h5>

    <ListGroup>
      {youowe.map((item) => {
        const props: TakeProps = {
          handleNameClick: () => {},
          handlePayClick: () => {},
          ...item
        }
        return (
          <TakeListItemComponent
            {...props}/>
        )
      })}
    </ListGroup>

    <h5>You Leave</h5>

    <ListGroup>
      {youowe.map((item) => {
        const props: LeaveProps = {
          handleNameClick: () => {},
          handleAcceptClick: () => {},
          handleRejectClick: () => {},
          ...item
        }
        return (
          <LeaveListItemComponent
            {...props}/>
        )
      })}
    </ListGroup>

    <h5>History</h5>

    <ListGroup>
      {youowe.map(({name, amount}) => {
        return (
          <ListGroup.Item>
            {name} ${amount}
          </ListGroup.Item>
        )
      })}
    </ListGroup>
    </>
  )
}

export default BalancePage
