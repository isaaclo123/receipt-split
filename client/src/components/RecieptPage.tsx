import React from 'react'

import ListGroup from 'react-bootstrap/ListGroup';

import { RecieptProps, RecieptListItemComponent } from './RecieptListItemComponent';

const youowe = [ // TODO
  {
    name: "Fresh Thyme",
    amount: 54.00,
    pending: true,
  },
  {
    name: "Target",
    amount: 55.20,
    pending: false,
  },
]

const RecieptPage = () => {
  return (
    <>
      <h5>Out of Control</h5>

      <ListGroup className="pb-3">
        {youowe.map((item) => {
          const props: RecieptProps = {
            handleNameClick: () => {},
            handleViewClick: () => {},
            ...item
          }
          return (
            <RecieptListItemComponent
              {...props}/>
          )
        })}
      </ListGroup>

      <h5>Under Control</h5>

      <ListGroup className="pb-3">
        {youowe.map((item) => {
          const props: RecieptProps = {
            handleNameClick: () => {},
            handleViewClick: () => {},
            ...item
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

export default RecieptPage
