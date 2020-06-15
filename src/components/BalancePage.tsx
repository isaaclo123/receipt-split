import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import CardColumns from "react-bootstrap/CardColumns";

import {
  BalanceCardComponent,
  PayModal
} from "./index";

import {
  getPaymentListAndBalances,
  getBalanceSumList,
  setPaymentAmount,
  setPaymentUser,
  setPaymentMessage,
} from "../actions/index";

import {
  RootState,
  BalanceSumType,
  Dict,
  PaymentType,
} from "../types/index";
import { ListGroup } from "react-bootstrap";

const mapStateToProps = (state: RootState) => {
  const {
    balanceSumListState,
    paymentListState,
  } = state;
  return {
    paymentListState,
    balanceSumListState,
  };
};

const connector = connect(
  mapStateToProps,
  {
    getPaymentListAndBalances,
    getBalanceSumList,
    setPaymentAmount,
    setPaymentUser,
    setPaymentMessage,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteComponentProps<{}>;

const BalancePageComponent = ({
  match,
  history,

  balanceSumListState,
  paymentListState,

  getPaymentListAndBalances,
  getBalanceSumList,
  setPaymentAmount,
  setPaymentUser,
  setPaymentMessage,
}: Props) => {
  const [run, setRun] = useState(true);
  const [payShow, setPayShow] = useState(false);

  const balanceErrors = (balanceSumListState.errors != null) ? balanceSumListState.errors : {};
  const paymentErrors = (paymentListState.errors != null) ? paymentListState.errors : {};

  // gets user info once
  if (run) {
    setRun(false);
    getPaymentListAndBalances()
  }

  const {
    balances_owed,
    balances_of
  } = balanceSumListState.data;

  const {
    payments_received,
    payments_sent
  } = paymentListState.data;

  const getBalanceList = (balances_list: BalanceSumType[], props: Dict) => (
    <CardColumns>
      {balances_list.map((balanceSum : BalanceSumType) => {

        const {
          total,
          user
        } = balanceSum;

        const {
          id = -1
        } = user;

        return (
          <BalanceCardComponent
            key={id}
            onPay={() => {
              setPaymentAmount(total);
              setPaymentUser(user);
              // TODO dont know if message should be reset
              setPaymentMessage("");
              setPayShow(true);
            }}
            {...balanceSum} {...props}/>
        );
      })}
    </CardColumns>
    )

  return (
    <>
      <PayModal
        show={payShow}
        onClose={() => {
          setPayShow(false);
        }}
      />

      { ("error" in balanceErrors) &&
        <>
          <Alert variant="danger">
            {balanceErrors.error}
          </Alert>
          <br />
        </>}

      { ("error" in paymentErrors) &&
        <>
          <Alert variant="danger">
            {paymentErrors.error}
          </Alert>
          <br />
        </>}

      <h5>Payments Received</h5>

      <ListGroup>
        {payments_received.map(({
          id = -1,
          date,
          accepted,
          message,
          to_user,
          amount
        }: PaymentType) => {
        return (
          <ListGroup.Item>
            {amount} {message} {to_user.fullname} {date}
          </ListGroup.Item>
        );
      })}
      </ListGroup>

      <h5>Payments Sent</h5>

      <ListGroup>
        {payments_sent.map(({
          id = -1,
          date,
          accepted,
          message,
          from_user,
          amount
        }: PaymentType) => {
        return (
          <ListGroup.Item>
            {amount} {message} {from_user.fullname} {date}
          </ListGroup.Item>
        );
      })}
      </ListGroup>

      <h5>Balances to Pay</h5>

      {getBalanceList(balances_of, {
        amountColor: "danger",
      })}

      <h5>Balances Owed</h5>

      {getBalanceList(balances_owed, {
        amountColor: "success",
        showPay: false
      })}

      <br />
    </>
  );
};

export const BalancePage = connector(BalancePageComponent);
