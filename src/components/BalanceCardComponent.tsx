import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { BalanceSumType, BalanceSummaryType } from "../types/index";

import {
  ReceiptListItemComponent
} from "./index";

import {
  BalanceType
} from "../types/index";

export interface BalanceCardProps extends BalanceSumType {
  onPay ?: () => void
};

export const BalanceCardComponent = ({
  user,
  total,
  balances,
  onPay = () => {}
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
          <Button size="sm" onClick={onPay}>PAY</Button>
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
              {amount} for {receipt_name}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
        //{balances.map(item => {
        //  const props: LeaveProps = {
        //    handleNameClick: () => {},
        //    handlePayClick: () => {},
        //    ...item
        //  };
        //  return <LeaveListItemComponent {...props} />;
        //})}
};
