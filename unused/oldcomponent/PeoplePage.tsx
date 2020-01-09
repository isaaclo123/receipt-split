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
import { RecieptProps, RecieptListItemComponent } from './RecieptListItemComponent';
import { UserType, UserState, LoginState } from '../types/index'

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

const PeoplePage = ({match, userState, getUser, loginState}: Props) => {
  const [ friendText, setFriendText ] = useState("")
  const [ error, setError ] = useState("")

  const [ hide, setHide ] = useState(true)
  const [ run, setRun ] = useState(true)

  const { token="" } = loginState

  const addFriend = async () => {
    const result = await addUser(token, friendText)
    console.log(result)
    if (result.error != null) {
      setError(result.error)
      return
    }

    if (result == null) {
      setError("Api result invalid")
      return
    }
    console.log(result)
    setHide(true)
    getUser()
  }

  const onClose = () => {
    setFriendText("")
    setError("")
    setHide(true)
  }

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
      <Modal
        show={!hide}
        onHide={onClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Friend
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl aria-describedby="basic-input"
              isInvalid={error !== ""}
              value={friendText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFriendText(event.currentTarget.value)
              }}/>
            <InputGroup.Append>
              <Button variant="outline-primary" onClick={() => {addFriend()}}>Add</Button>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setHide(true)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <h5>User Info</h5>

      <ListGroup className="mb-3">
        <ListGroup.Item>
          <span className="float-left">
            <span className="text-primary">{fullname}</span>
          </span>
          <span className="float-right">
            ({username})
          </span>
        </ListGroup.Item>
      </ListGroup>

      <div className="align-middle">
        <h5 className="float-left">Friends</h5>
        <span className="text-primary float-right" onClick={() => setHide(false)}>+ Add Friends</span>
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
                <span className="text-primary">{fullname}</span>
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
