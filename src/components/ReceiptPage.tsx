import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";
// import { useHistory } from "react-router-dom";

import { RouteComponentProps } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";

import { LinkContainer } from "react-router-bootstrap";

import { getReceiptList } from "../actions/index";

import {
  ListOrNoneComponent,
  ReceiptProps,
  ReceiptListItemComponent
} from "./index";

import {
  RootState,
  ReceiptSummaryType,
  ReceiptListState
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
  RouteComponentProps<{}> & {
    receiptListState?: ReceiptListState;
  };

const ReceiptPageComponent = ({
  match,
  history,
  receiptListState,
  getReceiptList
}: Props) => {
  const [run, setRun] = useState(true);

  // gets user info once
  if (run) {
    setRun(false);
    getReceiptList();
  }

  const receiptEdit = (id: number) => {
    history.push(`${match.url}/edit/${id}`);
  };

  const receipts = receiptListState.data;

  return (
    <>
      <div className="align-middle">
        <h5 className="float-left">My Receipts</h5>

        <LinkContainer to={`${match.url}/edit/-1`}>
          <a onClick={() => {}} className="float-right">
            + New
          </a>
        </LinkContainer>
      </div>
      <br />
      <h5 />
      <ListGroup className="mb-3">
        <ListOrNoneComponent<ReceiptSummaryType>
          list={receipts}
          listComponent={({
            name = "",
            amount = -1,
            date = "",
            id = -1
          }: ReceiptSummaryType) => {
            const props: ReceiptProps = {
              pending: true,
              handleNameClick: () => {
                receiptEdit(id);
              },
              handleViewClick: () => {
                receiptEdit(id);
              },
              amount,
              name
            };
            return <ReceiptListItemComponent key={id} {...props} />;
          }}
          noneComponent={
            <ListGroup.Item>
              <a onClick={() => {}}>None</a>
            </ListGroup.Item>
          }
        />
      </ListGroup>
    </>
  );
};

export const ReceiptPage = connector(ReceiptPageComponent);
