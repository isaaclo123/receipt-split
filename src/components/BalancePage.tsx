import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import CardColumns from "react-bootstrap/CardColumns";
import Col from "react-bootstrap/Col";

import {
  AcceptRejectButtonsType,
  BalanceCardComponent,
  PayModal,
  AcceptRejectComponent
} from "./index";

import {
  getPaymentListAndBalances,
  getBalanceSumList,
  setPaymentAmount,
  setPaymentUser,
  setPaymentMessage,
  setPaymentConfirm,
} from "../actions/index";

import {
  RootState,
  BalanceSumType,
  Dict,
  PaymentType,
} from "../types/index";
import { ListGroup } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import ButtonGroup from "react-bootstrap/ButtonGroup";

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
    setPaymentConfirm,
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
  setPaymentConfirm,
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
    balances_owned
  } = balanceSumListState.data;

  const {
    payments_received,
    payments_sent
  } = paymentListState.data;

  console.log("paymentListState")
  console.log(paymentListState)
  console.log(payments_received)
  console.log(payments_sent)
  console.log("paymentListState")

  const getBalanceList = (balances_list: BalanceSumType[], props: Dict) => (
    <CardColumns>
      {balances_list.map((balanceSum : BalanceSumType) => {

        const {
          owed_amount,
          paid_amount,
          user
        } = balanceSum;

        const {
          id = -1
        } = user;

        return (
          <BalanceCardComponent
            key={id}
            onPay={() => {
              setPaymentAmount(owed_amount - paid_amount);
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

      {(payments_received.length > 0) &&
      <>
        <h5>Payments Received</h5>

        <ListGroup className="mb-3">
          {payments_received.map(({
            id = -1,
            date,
            accepted,
            message,
            from_user = {
              id: -1,
              username: "",
              fullname: ""
            },
            amount
          }: PaymentType,
          index: number) => {
            return (
              <AcceptRejectComponent
                accepted={accepted}
                buttons={["accept", "reject"]}
                onAccept={() => {
                  setPaymentConfirm(id, "accept", index)
                }}
                onReject={() => {
                  setPaymentConfirm(id, "reject", index)
                }}
                messageComponent={(
                  <>
                    <span className="text-success">${amount.toFixed(2)}</span>
                    &nbsp;from&nbsp;
                    <span className="text-primary">{from_user.fullname}</span>
                    :&nbsp;
                    {message}
                  </>
                  )}
              / >
            );
        })}
        </ListGroup>
      </>
      }

      {(payments_sent.length > 0) &&
      <>
        <h5>Payments Sent</h5>

        <ListGroup className="mb-3">
          {payments_sent.map(({
            id = -1,
            date,
            accepted,
            message,
            to_user = {
              id: -1,
              username: "",
              fullname: ""
            },
            amount
          }: PaymentType) => {
            const buttonType: AcceptRejectButtonsType = (
              (accepted === true && ["accept"]) ||
              (accepted === false && ["reject"]) ||
              (["pending"])
            );

            return (
              <AcceptRejectComponent
                accepted={accepted}
                buttons={buttonType}
                messageComponent={(
                  <>
                    <span className="text-danger">${amount.toFixed(2)}</span>
                    &nbsp;to&nbsp;
                    <span className="text-primary">{to_user.fullname}</span>
                    :&nbsp;
                    {message}
                  </>
                  )}
              / >
            );
          })}
        </ListGroup>
      </>
      }

      <h5>Balances to Pay</h5>

      {getBalanceList(balances_owned, {
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
