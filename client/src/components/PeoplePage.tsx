import React, {useState} from 'react'

import { connect, ConnectedProps } from 'react-redux'
import { useHistory } from "react-router-dom";

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup';

import { getUser } from '../actions/getUser'
import { RecieptProps, RecieptListItemComponent } from './RecieptListItemComponent';
import { UserType, UserState } from '../types/index'

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
}

const PeoplePage = ({match, userState, getUser}: Props) => {
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

  const { friends, username, fullname } = user

  return (
    <>
      <h5>User Info</h5>

      <ListGroup className="mb-3">
        <ListGroup.Item>
          <h5 className="float-left">
            {fullname}
          </h5>
          <h5 className="float-right">
            ({username})
          </h5>
        </ListGroup.Item>
      </ListGroup>

      <div className="align-middle">
        <h5 className="float-left">Friends</h5>
        <a href="#" className="float-right">+ Add Friends</a>
      </div>
      <br />
      <h5 />

      <ListGroup className="mb-3">
        {(friends == null || friends.length <= 0) &&
          (<ListGroup.Item>
            <span className="text-secondary">
              None
            </span>
          </ListGroup.Item>)
        }

        {(friends != null) && friends.map(({
          username="",
          fullname="",
          id=-1
          }: UserType) => {
            return (<ListGroup.Item>
              <span className="float-left">
                {fullname}
              </span>
              <span className="float-right">
                ({username})
              </span>
            </ListGroup.Item>)
        })}
      </ListGroup>
    </>
  )
}

export default connector(PeoplePage)
