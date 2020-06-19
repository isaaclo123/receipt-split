import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { BalanceSumType, BalanceSummaryType } from "../types/index";
import { LinkContainer } from "react-router-bootstrap";

export interface BalanceCardProps extends BalanceSumType {
  onPay?: () => void,
  showPay?: boolean,
  amountColor?: string,
};

export const BalanceCardComponent = ({
  user,
  owed_amount,
  paid_amount,
  balances,
  onPay = () => {},
  amountColor = "info",
  showPay = true,
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
        {showPay &&
          <span className="float-right">
            <Button size="sm" onClick={() => {onPay()}}>PAY</Button>
          </span>}
        <br />
      </Card.Header>

      <Card.Body className="text-center px-0">
        <h2
          style={{
            padding: 0,
            margin: 0,
            display: "inline-block",
            overflow: "auto"
          }}
          className={`text-${amountColor} align-middle`}
        >
          <span>${owed_amount.toFixed(2)}&nbsp;-&nbsp;${paid_amount.toFixed(2)}</span>
          <br />
          $<u>{(owed_amount - paid_amount).toFixed(2)}</u>
        </h2>
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
            <ListGroup.Item key={id} className="d-inline-block text-truncate">
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
