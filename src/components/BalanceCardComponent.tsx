import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { BalanceSumType, BalanceSummaryType } from "../types/index";
import { LinkContainer } from "react-router-bootstrap";

export interface BalanceCardProps extends BalanceSumType {
  onPay ?: () => void
};

export const BalanceCardComponent = ({
  user,
  total,
  balances,
  onPay = () => {},
}: BalanceCardProps) => {
  return (
    <Card>
      <Card.Header
        style={{
          lineHeight: "2rem"
        }}
      >
        <span className="float-left">
          <span className="text-primary">{user.fullname}</span>
        </span>
        <span className="float-right">
          <Button size="sm" onClick={() => {onPay()}}>PAY</Button>
        </span>
        <br />
      </Card.Header>

      <Card.Body className="text-center px-0">
        <h1
          style={{
            padding: 0,
            margin: 0,
            display: "inline-block",
            overflow: "auto"
          }}
          className={"text-danger"}
        >
          ${total.toFixed(2)}
        </h1>
      </Card.Body>

      <hr
        style={{
          padding: 0,
          margin: 0
        }}
      />

      <ListGroup className="list-group-flush">
        {balances.map((balance: BalanceSummaryType) => {
          const {
            id = -1,
            amount,
            receipt_name,
            receipt_id,
          } = balance;

          return (
            <ListGroup.Item key={id}>
              <span className="text-info">
              ${amount.toFixed(2)}
              </span>
              &nbsp;for&nbsp;
              <LinkContainer to={`receipts/edit/${receipt_id}`}>
                <span className="text-primary">{receipt_name}</span>
              </LinkContainer>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
};
