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
  getBalanceSumList,
  setPaymentAmount,
  setPaymentUser,
  setPaymentMessage,
} from "../actions/index";

import {
  RootState,
  BalanceSumType,
  Dict,
} from "../types/index";

const mapStateToProps = (state: RootState) => {
  const {
    balanceSumListState,
  } = state;
  return {
    balanceSumListState,
  };
};

const connector = connect(
  mapStateToProps,
  {
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
  getBalanceSumList,
  setPaymentAmount,
  setPaymentUser,
  setPaymentMessage,
}: Props) => {
  const [run, setRun] = useState(true);
  const [payShow, setPayShow] = useState(false);

  const errors = (balanceSumListState.errors != null) ? balanceSumListState.errors : {};

  // gets user info once
  if (run) {
    setRun(false);
    getBalanceSumList()
  }

  const {
    balances_owed,
    balances_of
  } = balanceSumListState.data;

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
      { ("error" in errors) &&
        <>
          <Alert variant="danger">
            {errors.error}
          </Alert>
          <br />
        </>}

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
