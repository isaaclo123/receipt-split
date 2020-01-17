import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";

// import { getUser } from "../actions/getUser";

import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import { Redirect, RouteComponentProps } from "react-router-dom";

import { ListOrNoneComponent } from "./index";

import { getReciept } from "../actions/index";
// import { setReciept } from "../actions/setReciept";
// import { saveReciept } from "../actions/saveReciept";

import {
  RecieptType,
  RecieptItemType,
  RecieptState,
  UserType,
  BalanceType,
  RootState
} from "../types/index";

import {
  BadgeListProps,
  BadgeListComponent,
  UserSelectModal,
  UserSelectProps,
  ExpenseCardComponent,
  TextInputComponent
} from "./index";

type MatchParams = {
  id: string;
};

const mapStateToProps = (state: RootState) => {
  const { recieptState, userState } = state;
  return {
    // people: userState.user.friends.concat(userState.user),
    recieptState,
    userState
  };
};

const connector = connect(
  mapStateToProps,
  { getReciept }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteComponentProps<MatchParams> & {
    recieptState?: RecieptState;
  };

const RecieptEditPageComponent = ({
  match,
  userState,
  recieptState,
  getReciept
}: // getUser,
//people
Props) => {
  const [run, setRun] = useState(true);

  const blankUserList: UserType[] = [];

  const [modalState, setModalState] = useState({
    show: false
    // addedusers: blankUserList,
    // modalcallback: (user: UserType) => {}
  });

  const { show } = modalState;

  const reciept_id = Number(match.params.id) || -1;

  console.log("RECIEPTID");
  console.log(reciept_id);
  console.log("RECIEPTID");

  if (run) {
    getReciept(reciept_id);
    setRun(false);
  }
  console.log(recieptState);

  const {
    id = -1,
    balances = [],
    name,
    amount,
    user,
    users = [],
    reciept_items = [],
    date
  }: RecieptType = recieptState.data;

  const onSave = () => {
    const payload = { ...recieptState.data, id };
    console.log("PAYLOADkjyyp");
    console.log(payload);
    console.log("PAYLOADkjyyp");
    // saveReciept(recieptState.reciept); TODO
    // getUser();
    console.log("GOT USER");
  };

  return (
    <>
      <div className="align-middle mb-3">
        <h5
          className="float-left m-0 p-0"
          style={{ display: "inline", lineHeight: "2rem" }}
        >
          Reciept Info
        </h5>
        <Button
          size="sm"
          className="float-right"
          onClick={() => {
            onSave();
          }}
        >
          SAVE
        </Button>
      </div>
      <br />
      <ExpenseCardComponent
        extraComponent={
          <>
            Paid by{" "}
            <span className="text-primary">
              {user == null ? "Unknown" : user.fullname}
            </span>{" "}
            on &nbsp;
            <TextInputComponent
              size={40}
              type="text"
              value={date}
              handleTextChange={(date: string) => {}}
            />
            <br />
          </>
        }
        prefix="*"
        variant="info"
        name={name}
        handleNameChange={(name: string) => {}}
        amount={amount}
        handleAmountChange={(amount: number) => {}}
        handleDeleteClick={() => {
          alert("delete");
        }}
        users={users}
        handleUserClick={() => {}}
        handleDeleteUserClick={(i: number) => {}}
        handleAddUserClick={() => {}}
      />
      <div className="align-middle">
        <h5 className="float-left">Sub-expenses</h5>
        <span className="float-right text-primary" onClick={() => {}}>
          + Add Item
        </span>
      </div>
      <br />
      <h5 />
      <ListOrNoneComponent<RecieptItemType>
        list={reciept_items}
        noneComponent={
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <span className="float-left text-secondary">None</span>
              </Card.Title>
            </Card.Body>
          </Card>
        }
        listComponent={(
          { name, amount, users = blankUserList }: RecieptItemType,
          i = -1
        ) => {
          return (
            <ExpenseCardComponent
              prefix="-"
              variant="danger"
              name={name}
              handleNameChange={(name: string) => {}}
              amount={amount}
              handleAmountChange={(amount: number) => {}}
              users={users}
              handleDeleteClick={() => {}}
              handleUserClick={(i: number) => {}}
              handleDeleteUserClick={(i: number) => {}}
              handleAddUserClick={() => {}}
            />
          );
        }}
      />
      <h5>Balance</h5>
      <ListOrNoneComponent
        list={balances}
        noneComponent={<div>None</div>}
        listComponent={({ to_user, from_user, amount }: BalanceType) => {
          return (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>
                  <span className="float-left">
                    <span className="text-primary">{from_user.fullname}</span>{" "}
                    pays{" "}
                    <span className="text-primary">{to_user.fullname}</span>
                  </span>
                  <span className="text-info float-right">
                    ${amount.toFixed(2)}
                  </span>
                </Card.Title>
              </Card.Body>
            </Card>
          );
        }}
      />
    </>
  );
};

//       <UserSelectModal
//         show={show}
//         onHide={() => {
//           setModalState({
//             show: false
//           });
//         }}
//         users={[]}
//         title="Friends"
//         onUserSelect={() => {}}
//       />

export const RecieptEditPage = connector(RecieptEditPageComponent);
