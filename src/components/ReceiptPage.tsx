import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";
// import { useHistory } from "react-router-dom";

import { RouteComponentProps } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import { LinkContainer } from "react-router-bootstrap";

import { getReceiptList } from "../actions/index";

import { apiArchive } from "../api/index";

import NumberFormat from 'react-number-format';

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import {
  ListOrNoneComponent,
} from "./index";

import {
  RootState,
  ReceiptSummaryType,
  RECEIPT_PAGE,
  CURRENCY_FORMAT,
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
  // const [run, setRun] = useState(true);

  apiArchive(RECEIPT_PAGE);

  const errors = (receiptListState.errors != null) ? receiptListState.errors : {};

  // gets user info once
  // if (run) {
  //   setRun(false);
  //   getReceiptList();
  // }

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
            <LinkContainer to={`${match.url}/edit/${id}`}>
              <ListGroup.Item className="d-inline-block text-truncate">
                <NumberFormat
                  className="text-info"
                  displayType="text"
                  value={amount}
                  prefix="$"
                  {...CURRENCY_FORMAT}/>
                &nbsp;for&nbsp;
                <Button variant="link" className="m-0 p-0 stretched-link">{name}</Button>
                &nbsp;by&nbsp;
                <span className="text-primary">{user.fullname}</span>
              </ListGroup.Item>
            </LinkContainer>
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
        <Alert variant="danger">
          {errors.error}
        </Alert>
      : <></>}

      <div className="align-middle">
        <h5 className="float-left">My Receipts</h5>

        <LinkContainer to={`${match.url}/edit/-1`}>
          <Button variant="link" className="m-0 p-0 float-right">+ New</Button>
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
      { receiptListOrNoneComponent(receiptListState.data.receipts_owed) }

      <div className="align-middle">
        <h5 className="float-left">My Resolved Receipts</h5>
      </div>
      <br />
      <h5 />
      { receiptListOrNoneComponent(receiptListState.data.receipts_owned_resolved) }

      <div className="align-middle">
        <h5 className="float-left">Receipts In Resolved</h5>
      </div>
      <br />
      <h5 />
      { receiptListOrNoneComponent(receiptListState.data.receipts_owed_resolved) }
    </>
  );
};

export const ReceiptPage = connector(ReceiptPageComponent);
