import React from "react";

import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { TakeProps, TakeListItemComponent } from "./TakeListItemComponent";
import { LeaveProps, LeaveListItemComponent } from "./LeaveListItemComponent";

const youowe = [
  // TODO
  {
    name: "bill",
    amount: 5.0,
    pending: true
  },
  {
    name: "bill2",
    amount: 5.2,
    pending: false
  }
];

const BalancePageComponent = () => {
  return (
    <>
      <h5>Payment</h5>

      <ListGroup className="mb-3">
        {youowe.map(item => {
          const props: TakeProps = {
            handleNameClick: () => {},
            handleAcceptClick: () => {},
            handleRejectClick: () => {},
            ...item
          };
          return <TakeListItemComponent {...props} />;
        })}
      </ListGroup>

      <h5>To Pay</h5>

      <CardColumns>
        <Card>
          <Card.Header
            style={{
              lineHeight: "2rem"
            }}
          >
            <span className="float-left">
              <a href="#">Featured</a>
            </span>
            <span className="float-right">
              <Button size="sm">PAY</Button>
            </span>
            <br />
          </Card.Header>

          <Card.Body className="text-center">
            <h1
              style={{
                padding: 0,
                margin: 0,
                display: "inline-block"
              }}
            >
              $100.00
            </h1>
          </Card.Body>

          <hr
            style={{
              padding: 0,
              margin: 0
            }}
          />

          <ListGroup className="list-group-flush">
            {youowe.map(item => {
              const props: LeaveProps = {
                handleNameClick: () => {},
                handlePayClick: () => {},
                ...item
              };
              return <LeaveListItemComponent {...props} />;
            })}
          </ListGroup>
        </Card>
      </CardColumns>

      <ListGroup className="mb-3">
        {youowe.map(item => {
          const props: LeaveProps = {
            handleNameClick: () => {},
            handlePayClick: () => {},
            ...item
          };
          return <LeaveListItemComponent {...props} />;
        })}
      </ListGroup>

      <h5>History</h5>

      <ListGroup className="mb-3">
        {youowe.map(({ name, amount }) => {
          return (
            <ListGroup.Item>
              {name} ${amount}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};

export const BalancePage = BalancePageComponent;
