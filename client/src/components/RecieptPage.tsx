import React from 'react'

import { connect, ConnectedProps } from 'react-redux'
import { useHistory } from "react-router-dom";

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup';

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
  const history = useHistory()

  if (recieptListState == null) {
    return <Redirect to={'/app'} />
  }

  const recieptEdit = (id: number) => {
    console.log(`${match.url}/${id}`)
    history.push(`${match.url}/${id}`)
  }

  const { reciepts } = recieptListState

  return (
    <>
      <div className="align-middle">
        <h5 className="float-left">Unresolved Reciepts</h5>
        <a href="#" className="float-right">+ New</a>
      </div>
      <br />
      <h5 />

      <ListGroup className="mb-3">
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
              {...props}/>
          )
        })}
      </ListGroup>
    </>
  )
}

export default connector(RecieptPage)
