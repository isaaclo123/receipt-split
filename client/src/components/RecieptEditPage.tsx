import React, { useState } from 'react';

import { connect, ConnectedProps } from 'react-redux'

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import { getReciept } from '../actions/getReciept'
import { setReciept } from '../actions/setReciept'

import { RecieptType, RecieptState, UserType } from '../types/index'

import { BadgeListProps, BadgeListComponent } from './BadgeListComponent';

import { UserSelectModal, UserSelectProps } from './UserSelectModal';

import { ExpenseCardComponent } from './ExpenseCardComponent'

type MatchParams = {
  id: string;
}

const mapStateToProps = (state: any) => {
  const { recieptState, userState } = state
  return {
    recieptState,
    userState
  }
}

const connector = connect(
  mapStateToProps,
  { getReciept, setReciept }
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & {
  recieptState?: RecieptState
}


const RecieptEditPage = ({
  match,
  userState,
  recieptState,
  setReciept,
  getReciept
}: Props) => {
  const [ run, setRun ] = useState(true)

  const blankUserList: UserType[] = []

  const [ modalState, setModalState ] = useState({
    show: false,
    addedusers: blankUserList,
    modalcallback: (user: UserType) => {}
  })

  const {show, addedusers, modalcallback} = modalState

  const friends = userState.user.friends
  const you = userState.user
  const [ friend, setFriend ] = useState(you)

  const reciept_id = Number(match.params.id) || -1

  console.log(run)
  if (run) {
    getReciept({id: reciept_id})
    setRun(false)
  }
  console.log(recieptState)

  if (recieptState == null || recieptState.reciept == null) {
    return (<div>loading</div>)
  }

  const { reciept } = recieptState

  const { name, amount, user, users = [], reciept_items = [], date }: RecieptType = reciept

  const removeIndex = (list:UserType[], index:number) => {
    return list.filter((_:any, i:number) => i !== index)
  }

  const ListsDiff = (list1:UserType[], list2:UserType[]) => {
    return list1.filter((i) => {return list2.indexOf(i) < 0;});
  }

  return (
    <>
      <UserSelectModal
        show={show}
        onHide={() => {
          setModalState({
            ...modalState,
            show: false
        })}}
        users={ListsDiff(friends, addedusers)}
        title="Friends"
        onUserSelect={modalcallback} />

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
        handleNameChange={(name:string) => {
          setReciept({
            ...reciept,
            name
          })
        }}

        amount={amount}
        handleAmountChange={(amount:number) => {
          setReciept({
            ...reciept,
            amount
          })
        }}

        handleDeleteClick={() => {alert("delete")}}

        users={users}
        handleUserClick={() => {}}

        handleDeleteUserClick={(i:number) => {
          const test = removeIndex(users, i);
          console.log(test)
          setReciept({
            ...reciept,
            users: removeIndex(users, i)
          })
        }}

        handleAddUserClick={() => {
          setModalState({
            show: true,
            addedusers: users,
            modalcallback: (user: UserType) => {
              console.log(user)
              console.log(users.concat([user]))
              setReciept({
                ...reciept,
                users: users.concat([user])
              })
            }
          })
        }}
        />

      <div className="align-middle">
        <h5 className="float-left">Sub-expenses</h5>
        <a href="#" className="float-right">+ Add</a>
      </div>
      <br />
      <h5 />

      {(reciept_items == null || reciept_items.length <= 0) &&
        (<Card className="mb-3">
          <Card.Body>
            <Card.Title>
              <span className="float-left text-secondary">
                None
              </span>
            </Card.Title>
          </Card.Body>
        </Card>)
      }

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
