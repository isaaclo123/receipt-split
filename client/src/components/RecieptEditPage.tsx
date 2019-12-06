import React from 'react'

import Card from 'react-bootstrap/Card';

import {
  RouteComponentProps
} from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

interface MatchParams {
  id: string;
}

const RecieptEditPage = (props: RouteComponentProps<MatchParams>) => {
  const {match} = props

  const id = match.params.id

  return (
    <>
      <p>{id}</p>

      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </>
  )
}

export default RecieptEditPage
