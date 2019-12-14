import React from 'react';

import { connect, ConnectedProps } from 'react-redux'

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import { getReciept } from '../actions/getReciept'

import { RecieptType } from '../types/index'

import { BadgeListProps, BadgeListComponent } from './BadgeListComponent';

import { ExpenseCardComponent } from './ExpenseCardComponent'

type MatchParams = {
  id: string;
}

const mapStateToProps = (state: RecieptType, { match }: RouteComponentProps<MatchParams>) => {
  return state
}

const connector = connect(
  mapStateToProps,
  { getReciept }
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & {
  recieptState?: RecieptType
}


const RecieptEditPage = ({
  match,
  recieptState,
  getReciept
}: Props) => {
  if (recieptState == null) {
    return <Redirect to={'/app'} />
  }

  const { name, amount, user, users = [], reciept_items = [], date }: RecieptType = recieptState

  return (
    <>
      <h5>Reciept Info</h5>

      <ExpenseCardComponent
        extraComponent={
          (<>
            Paid by <a href="#">{ (user == null) ? "Unknown" : user.fullname }</a> on {date}
            <br />
          </>)
        }
        prefix="*"
        variant="info"

        name={name}
        handleNameChange={(name:string) => {alert(name)}}

        amount={amount}
        handleAmountChange={(amt:number) => {alert(amt)}}

        handleDeleteClick={() => {alert("delete")}}

        users={["one"]}
        handleUserClick={(i:number) => {alert(i)}}
        handleDeleteUserClick={(i:number) => {alert(i)}}
        handleAddUserClick={() => {}}
        />

      <div className="align-middle">
        <h5 className="float-left">Sub-expenses</h5>
        <a href="#" className="float-right">+ Add</a>
      </div>
      <br />
      <h5 />

      {(reciept_items != null) && reciept_items.map((props: any) => {
        const { name, amount, users } = props
        return (<ExpenseCardComponent
                  prefix="-"
                  variant="danger"

                  name={name}
                  handleNameChange={(name:string) => {alert(name)}}

                  amount={amount}
                  handleAmountChange={(amt:number) => {alert(amt)}}

                  users={users}

                  handleDeleteClick={() => {alert("delete card")}}

                  handleUserClick={(i:number) => {alert(i)}}
                  handleDeleteUserClick={(i:number) => {alert(i)}}
                  handleAddUserClick={() => {}} />)
      })}

      <h5>Balance</h5>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>
            <span className="float-left">
              You Pay
            </span>
            <span className="text-info float-right">${ (55).toFixed(2) }</span>
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  )
}

export default connector(RecieptEditPage)
