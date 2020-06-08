import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { LeaveProps, LeaveListItemComponent } from "./LeaveListItemComponent";
import { BalanceType } from "../types/index";

export interface BalanceCardProps {
  name: string;
  amount: number;
  onPay: () => void;
  balances: BalanceType[];
};

export const BalanceCardComponent = ({
  name,
  amount,
  onPay,
  balances,
}: BalanceCardProps) => {
  return (
    <Card>
      <Card.Header
        style={{
          lineHeight: "2rem"
        }}
      >
        <span className="float-left">
          <span className="text-primary">Featured</span>
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
          ${amount.toFixed(2)}
        </h1>
      </Card.Body>

      <hr
        style={{
          padding: 0,
          margin: 0
        }}
      />

      <ListGroup className="list-group-flush">
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
