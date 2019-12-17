import React, { useState } from 'react'

import { connect, ConnectedProps } from 'react-redux'
// import { useHistory } from "react-router-dom";

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup';

import { LinkContainer } from 'react-router-bootstrap'

import { getRecieptList } from '../actions/getReciept'
import { RecieptProps, RecieptListItemComponent } from './RecieptListItemComponent';
import { RecieptType, RecieptListState } from '../types/index'

const mapStateToProps = (state: RecieptListState ) => {
  return state
}

const connector = connect(
  mapStateToProps,
  { getRecieptList }
)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<{}> & {
  recieptListState?: RecieptListState
}

const RecieptPage = ({match, recieptListState, getRecieptList}: Props) => {
  const [ redirect, setRedirect ] = useState({
    redirect: false,
    id: -1,
  })

  const [ run, setRun ] = useState(true)

  // gets user info once
  if (run) {
    setRun(false)
    getRecieptList()
  }

  if (redirect.redirect) {
    return <Redirect to={`${match.url}/edit/${redirect.id}`} />
  }

  if (recieptListState == null) {
    return <Redirect to={'/app'} />
  }

  const recieptEdit = (id: number) => {
    // console.log(`${match.url}/edit/${id}`)
    // history.push(`${match.url}/edit/${id}`)
    setRedirect({
      redirect: true,
      id
    })
  }

  const { reciepts } = recieptListState

  return (
    <>
      <div className="align-middle">
        <h5 className="float-left">My Reciepts</h5>

        <LinkContainer to={`${match.url}/edit/-1`}>
          <a href="#" className="float-right">+ New</a>
        </LinkContainer>
      </div>
      <br />
      <h5 />

      <ListGroup className="mb-3">
        {(reciepts == null || reciepts.length <= 0) &&
          (<ListGroup.Item>
            <span className="text-secondary">
              None
            </span>
          </ListGroup.Item>)
        }
        {reciepts.map(({
          name="",
          amount=-1,
          date="",
          id=-1,
          }: RecieptType) => {
            console.log(`ID ${id}`)

          const props: RecieptProps = {
            pending: true,
            handleNameClick: () => {recieptEdit(id)},
            handleViewClick: () => {recieptEdit(id)},
            amount,
            name
          }
          return (
            <RecieptListItemComponent
              key={id}
              {...props}/>
          )
        })}
      </ListGroup>
    </>
  )
}

export default connector(RecieptPage)
