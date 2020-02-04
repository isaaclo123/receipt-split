import React, { useState } from 'react'

import { connect, ConnectedProps } from 'react-redux'
// import { useHistory } from "react-router-dom";

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup';

import { LinkContainer } from 'react-router-bootstrap'

import { getReceiptList } from '../actions/getReceipt'
import { ReceiptProps, ReceiptListItemComponent } from './ReceiptListItemComponent';
import { ReceiptType, ReceiptListState } from '../types/index'

const mapStateToProps = (state: ReceiptListState ) => {
  return state
}

const connector = connect(
  mapStateToProps,
  { getReceiptList }
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<{}> & {
  receiptListState?: ReceiptListState
}

const ReceiptPage = ({match, receiptListState, getReceiptList}: Props) => {
  const [ redirect, setRedirect ] = useState({
    redirect: false,
    id: -1,
  })

  const [ run, setRun ] = useState(true)

  // gets user info once
  if (run) {
    setRun(false)
    getReceiptList()
  }

  if (redirect.redirect) {
    return <Redirect to={`${match.url}/edit/${redirect.id}`} />
  }

  if (receiptListState == null) {
    return <Redirect to={'/app'} />
  }

  const receiptEdit = (id: number) => {
    // console.log(`${match.url}/edit/${id}`)
    // history.push(`${match.url}/edit/${id}`)
    setRedirect({
      redirect: true,
      id
    })
  }

  const { receipts } = receiptListState

  return (
    <>
      <div className="align-middle">
        <h5 className="float-left">My Receipts</h5>

        <LinkContainer to={`${match.url}/edit/-1`}>
          <span className="float-right text-primary">+ New</span>
        </LinkContainer>
      </div>
      <br />
      <h5 />

      <ListGroup className="mb-3">
        {(receipts == null || receipts.length <= 0) &&
          (<ListGroup.Item>
            <span className="text-secondary">
              None
            </span>
          </ListGroup.Item>)
        }
        {receipts.map(({
          name="",
          amount=-1,
          date="",
          id=-1,
          }: ReceiptType) => {
            console.log(`ID ${id}`)

          const props: ReceiptProps = {
            pending: true,
            handleNameClick: () => {receiptEdit(id)},
            handleViewClick: () => {receiptEdit(id)},
            amount,
            name
          }
          return (
            <ReceiptListItemComponent
              key={id}
              {...props}/>
          )
        })}
      </ListGroup>
    </>
  )
}

export default connector(ReceiptPage)
