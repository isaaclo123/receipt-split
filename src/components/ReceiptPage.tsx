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

  const errors = (receiptListState.errors != null) ? receiptListState.errors : {};

  // gets user info once
  if (run) {
    setRun(false);
    getReceiptList();
  }

  const receiptEdit = (id: number) => {
    history.push(`${match.url}/edit/${id}`);
  };

  const noneComponent = (
    <ListGroup.Item>
      <span className="text-secondary">None</span>
    </ListGroup.Item>
  );

  const receiptListOrNoneComponent = (receipt_list: ReceiptSummaryType[]) => (
    <ListGroup className="mb-3">
      <ListOrNoneComponent<ReceiptSummaryType>
        list={receipt_list}
        listComponent={(receiptSummary : ReceiptSummaryType) => {
          const { id=-1 } = receiptSummary
          const props: ReceiptProps = {
            handleNameClick: () => {
              receiptEdit(id);
            },
            handleViewClick: () => {
              receiptEdit(id);
            },
            ...receiptSummary
          };
          return <ReceiptListItemComponent key={id} {...props} />;
        }}
        noneComponent={noneComponent}
      />
    </ListGroup>
)

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
          <a onClick={() => {}} className="float-right">
            + New
          </a>
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
