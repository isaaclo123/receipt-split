import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import ListGroup from "react-bootstrap/ListGroup";

import { BalanceCardComponent } from "./index";
import { getBalanceSumList } from "../actions/index";

import {
  RootState,
  BalanceSumListState,
  BalanceSumType
} from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { balanceSumListState } = state;
  return {
    balanceSumListState
  };
};

const connector = connect(
  mapStateToProps,
  { getBalanceSumList }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteComponentProps<{}> & {
    balance_sums?: BalanceSumListState;
  };

const BalancePageComponent = ({
  match,
  balanceSumListState,
  getBalanceSumList
}: Props) => {
  const [run, setRun] = useState(true);
  const errors = (balanceSumListState.errors != null) ? balanceSumListState.errors : {};

  // gets user info once
  if (run) {
    setRun(false);
    getBalanceSumList()
  }

  const { balance_sums } = balanceSumListState.data;

  console.log(balanceSumListState.data.balance_sums)

  return (
    <>
      <h5>Balances to Pay</h5>

      <CardColumns>
        {balance_sums.map((balanceSum : BalanceSumType) => {
          const { id = -1 } = balanceSum.user;

          return (<BalanceCardComponent key={id} {...balanceSum}/>)
        })}
      </CardColumns>
    </>
  );
};

export const BalancePage = connector(BalancePageComponent);
