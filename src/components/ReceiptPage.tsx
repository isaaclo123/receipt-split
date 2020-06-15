import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";
// import { useHistory } from "react-router-dom";

import { RouteComponentProps } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import { LinkContainer } from "react-router-bootstrap";

import { getReceiptList } from "../actions/index";

import Alert from "react-bootstrap/Alert";

import {
  ListOrNoneComponent,
} from "./index";

import {
  RootState,
  ReceiptSummaryType,
  ReceiptListState,
} from "../types/index";

const mapStateToProps = (state: RootState) => {
  const { receiptListState } = state;
  return {
    receiptListState
  };
};

const connector = connect(
  mapStateToProps,
  { getReceiptList }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteComponentProps<{}>;

const ReceiptPageComponent = ({
  match,
  history,
  receiptListState,
  getReceiptList
}: Props) => {
  const [run, setRun] = useState(true);

  const errors = (receiptListState.errors != null) ? receiptListState.errors : {};

  // gets user info once
  if (run) {
    setRun(false);
    getReceiptList();
  }

  console.log(receiptListState);

  const receiptListOrNoneComponent = (receipt_list: ReceiptSummaryType[]) => (
    <ListGroup className="mb-3">
      <ListOrNoneComponent<ReceiptSummaryType>
        list={receipt_list}
        listComponent={({
          id = -1,
          name,
          amount,
          date,
          resolved,
          user
        }: ReceiptSummaryType) => {
          return (
            <>
              <ListGroup.Item className="d-inline-block text-truncate">
                <span className="text-info">${amount.toFixed(2)}</span>
                &nbsp;for&nbsp;
                <LinkContainer to={`${match.url}/edit/${id}`}>
                  <span className="text-primary">{name}</span>
                </LinkContainer>
                &nbsp;by&nbsp;
                <span className="text-primary">{user.fullname}</span>
              </ListGroup.Item>
            </>
          );
        }}
        noneComponent={(
          <ListGroup.Item>
            <span className="text-secondary">None</span>
          </ListGroup.Item>
        )}
      />
    </ListGroup>
  );

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

      <div className="align-middle">
        <h5 className="float-left">My Receipts</h5>

        <LinkContainer to={`${match.url}/edit/-1`}>
          <span className="float-right text-primary">
            + New
          </span>
        </LinkContainer>
      </div>
      <br />
      <h5 />
      { receiptListOrNoneComponent(receiptListState.data.receipts_owned) }

      <div className="align-middle">
        <h5 className="float-left">Receipts In</h5>
      </div>
      <br />
      <h5 />
      { receiptListOrNoneComponent(receiptListState.data.receipts_of) }
    </>
  );
};

export const ReceiptPage = connector(ReceiptPageComponent);
