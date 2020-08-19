import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { BalanceSumType, BalanceSummaryType, CURRENCY_FORMAT } from "../types/index";
import { LinkContainer } from "react-router-bootstrap";

import NumberFormat from 'react-number-format';

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

      <Card.Body
        className="text-center px-0">
        <h2
          style={{
            padding: 0,
            margin: 0,
            display: "inline-block",
            overflow: "auto"
          }}
          className={`text-${amountColor} align-middle`}
        >
          <span>
            <NumberFormat
              displayType="text"
              value={Math.abs(owed_amount)}
              prefix={`${(owed_amount < 0) ? "-" : ""}$`}
              {...CURRENCY_FORMAT}/>
            &nbsp;
            <NumberFormat
              displayType="text"
              value={Math.abs(paid_amount)}
              prefix={`${(paid_amount < 0) ? "+" : "-"} $`}
              {...CURRENCY_FORMAT}/>
          </span>
          <br />
          $
          <u>
            <NumberFormat
              displayType="text"
              value={owed_amount - paid_amount}
              {...CURRENCY_FORMAT}/>
          </u>
        </h2>
      </Card.Body>

      <hr
        style={{
          padding: 0,
          margin: 0
        }}
      />

      <ListGroup
        style={{
          borderTop: 0
        }}
        className="list-group-flush">
        {balances.map((balance: BalanceSummaryType) => {
          const {
            id = -1,
            amount,
            receipt_name,
            receipt_id,
          } = balance;

          return (
            <LinkContainer to={`receipts/edit/${receipt_id}`}>
              <ListGroup.Item key={id} className="d-inline-block text-truncate">
                <NumberFormat
                  className="text-info"
                  displayType="text"
                  value={amount}
                  prefix="$"
                  {...CURRENCY_FORMAT}/>
                &nbsp;for&nbsp;
                <Button variant="link" className="m-0 p-0 stretched-link">{receipt_name}</Button>
              </ListGroup.Item>
            </LinkContainer>
          );
        })}
      </ListGroup>
    </Card>
  );
};
