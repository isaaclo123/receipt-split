import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import CardColumns from "react-bootstrap/CardColumns";

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
  history,
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

  const { balances_of } = balanceSumListState.data;

  return (
    <>
      { ("error" in errors) ?
        <>
          <Alert variant="danger">
            {errors.error}
          </Alert>
          <br />
        </>
      : <></>}

      <h5>Balances to Pay</h5>

      <CardColumns>
        {balances_of.map((balanceSum : BalanceSumType) => {
          const { id = -1 } = balanceSum.user;

          return (
            <BalanceCardComponent
              key={id}
              {...balanceSum} />
          );
        })}
      </CardColumns>
    </>
  );
};

export const BalancePage = connector(BalancePageComponent);
