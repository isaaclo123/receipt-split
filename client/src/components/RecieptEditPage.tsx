import React from 'react'

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import {
  Redirect,
  RouteComponentProps
} from 'react-router-dom'

import { BadgeListProps, BadgeListComponent } from './BadgeListComponent';

interface MatchParams {
  id: string;
}

const RecieptEditPage = (props: RouteComponentProps<MatchParams>) => {
  const { match } = props

  const id = parseInt(match.params.id, 10) || -1;

  const total = 100

  const users = [
    "Isaac",
    "Oliver",
  ]

  if (id < 0) {
    return <Redirect to={'/app'} />
  }

  return (
    <>
      <h5>Reciept Info {id}</h5>

      <Card>
        <Card.Body>
          <Card.Title>
            <span className="float-left">
              Reciept
            </span>
            <span className="text-info float-right">${ total }</span>
            <br />
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
          </Card.Subtitle>
          <Card.Text className="align-middle">
              Paid by <a href="#">{"hi"}</a> on {"1/2/23"}
            <br />
              <span className="align-middle">
                With&nbsp;
              </span>

              <BadgeListComponent
                items={users}
                handleItemClick={(x) => { alert(`clicked ${x}`) }}
                handleDeleteClick={(x) => {alert(`delete ${x}`)}}
                handleAddClick={() => {alert("clicked")}} />

          </Card.Text>
        </Card.Body>
      </Card>

      <h5>Reciept Info {id}</h5>
    </>
  )
}

export default RecieptEditPage
