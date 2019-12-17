import React, { useState } from 'react';

import { connect, ConnectedProps } from 'react-redux'

import { getUser } from '../actions/getUser'

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import { getReciept } from '../actions/getReciept'
import { setReciept } from '../actions/setReciept'
import { saveReciept } from '../actions/saveReciept'

import { RecieptType, RecieptItemType, RecieptState, UserType, RecieptItemTypeDefault, BalanceType } from '../types/index'

import { BadgeListProps, BadgeListComponent } from './BadgeListComponent';

import { UserSelectModal, UserSelectProps } from './UserSelectModal';

import { ExpenseCardComponent } from './ExpenseCardComponent'

import { TextInputComponent } from './TextInputComponent'

type MatchParams = {
  id: string;
}

const mapStateToProps = (state: any) => {
  const { recieptState, userState } = state
  return {
    people: userState.user.friends.concat(userState.user),
    recieptState,
    userState
  }
}

const connector = connect(
  mapStateToProps,
  { getReciept, setReciept, saveReciept, getUser }
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
  saveReciept,
  getReciept,
  getUser,
  people
}: Props) => {
  const [ run, setRun ] = useState(true)

  const blankUserList: UserType[] = []

  const [ modalState, setModalState ] = useState({
    show: false,
    addedusers: blankUserList,
    modalcallback: (user: UserType) => {}
  })

  const {show, addedusers, modalcallback} = modalState

  const reciept_id = Number(match.params.id) || -1

  console.log("RECIEPTID")
  console.log(reciept_id)
  console.log("RECIEPTID")

  if (run) {
    getReciept({id: reciept_id})
    setRun(false)
  }
  console.log(recieptState)

  if (recieptState == null || recieptState.reciept == null) {
    return (<Redirect to={`${match.url}/reciepts`} />)
  }

  const { reciept } = recieptState

  const { id=-1, balances = [], name, amount, user, users = [], reciept_items = [], date }: RecieptType = reciept

  const onSave = () => {
    const payload = {...recieptState.reciept, id}
    console.log("PAYLOADkjyyp")
    console.log(payload)
    console.log("PAYLOADkjyyp")
    saveReciept(recieptState.reciept)
    getUser()
    console.log("GOT USER")
  }

  const removeIndex = (list:UserType[], index:number) => {
    return list.filter((_:UserType, i:number) => i !== index)
  }

  const listDiff = (list1:UserType[], list2:UserType[]) => {
    return list1.filter((i) => {
      for (let j = 0; j < list2.length; j++) {
        if (i.id === list2[j].id) {
          return false
        }
      }
      return true
    })
  }

  const insertIndex = (state:RecieptItemType[], newItem:RecieptItemType, insertAt:number) => {
    return [
      ...state.slice(0, insertAt),
      newItem,
      ...state.slice(insertAt+1)
    ]
  }

  const deleteIndex = (state:RecieptItemType[], deleteAt:number) => {
    return [
      ...state.slice(0, deleteAt),
      ...state.slice(deleteAt+1)
    ]
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
        users={listDiff(people, addedusers)}
        title="Friends"
        onUserSelect={modalcallback} />

      <div className="align-middle mb-3">
        <h5 className="float-left m-0 p-0" style={{display: "inline", lineHeight: "2rem"}}>Reciept Info</h5>
        <Button size="sm" className="float-right"
          onClick={() => {
            onSave()
          }}>SAVE</Button>
      </div>
      <br />

      <ExpenseCardComponent
        extraComponent={
          (<>
            Paid by <span className="text-primary">{ (user == null) ? "Unknown" : user.fullname }</span> on &nbsp;
            <TextInputComponent
              size={40}
              type="text"
              value={date}
              handleTextChange={(date:string) => {
                setReciept({
                  ...reciept,
                  date
                })
              }}
              />
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
          console.log(name)
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
        <span
          className="float-right text-primary"
          onClick={() => {
            setReciept({
              ...reciept,
              reciept_items: [RecieptItemTypeDefault].concat(reciept_items)
            })
          }}>+ Add Item</span>
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

      {(reciept_items != null) && reciept_items.map(({
          name, amount, users=blankUserList
        }: RecieptItemType, i:number) => {
        return (<ExpenseCardComponent
                  prefix="-"
                  variant="danger"

                  name={name}
                  handleNameChange={(name:string) => {
                    setReciept({
                      ...reciept,
                      reciept_items: insertIndex(
                        reciept_items,
                        {
                          ...reciept_items[i],
                          name
                        },
                        i
                      )
                    })
                  }}

                  amount={amount}
                  handleAmountChange={(amount:number) => {
                    setReciept({
                      ...reciept,
                      reciept_items: insertIndex(
                        reciept_items,
                        {
                          ...reciept_items[i],
                          amount
                        },
                        i
                      )
                    })
                  }}

                  users={users}

                  handleDeleteClick={() => {
                    setReciept({
                      ...reciept,
                      reciept_items: deleteIndex(reciept_items, i)
                    })
                  }}

                  handleUserClick={(i:number) => {}}

                  handleDeleteUserClick={(i:number) => {
                    const removebadgeuser:UserType[] = removeIndex(users, i)
                    setReciept({
                      ...reciept,
                      reciept_items: insertIndex(
                        reciept_items, {
                          ...reciept_items[i],
                          users: removebadgeuser
                        }, i)
                      })
                  }}

                  handleAddUserClick={() => {
                    setModalState({
                      show: true,
                      addedusers: users,
                      modalcallback: (user: UserType) => {
                        setReciept({
                          ...reciept,
                          reciept_items: insertIndex(
                            reciept_items,
                            {
                              ...reciept_items[i],
                              users: users.concat([user])
                            },
                            i)
                        })
                      }
                    })
                  }}
                  />)
      })}

      <h5>Balance</h5>

      {(balances == null || balances === []) && <div>None</div>}

      {balances.map(({
          to_user,
          from_user,
          amount
        }: BalanceType) => {
        return (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <span className="float-left">
                  <span className="text-primary">{ from_user.fullname }</span> pays <span className="text-primary">{ to_user.fullname }</span>
                </span>
                <span className="text-info float-right">${ (amount).toFixed(2) }</span>
              </Card.Title>
            </Card.Body>
          </Card>
        )
      })}
    </>
  )
}

export default connector(RecieptEditPage)
