import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";

// import { getUser } from "../actions/getUser";

import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import { Redirect, RouteComponentProps } from "react-router-dom";

import { ListOrNoneComponent } from "./index";

import {
  getReceipt,
  setReceiptName,
  setReceiptAmount,
  setReceiptDate,
  addReceiptUser,
  addReceiptItem,
  deleteReceiptItem,
  deleteReceiptUser,
  setReceiptItemName,
  setReceiptItemAmount,
  addReceiptItemUser,
  deleteReceiptItemUser,
  saveReceipt
} from "../actions/index";
// import { setReceipt } from "../actions/setReceipt";
// import { saveReceipt } from "../actions/saveReceipt";

import {
  ReceiptType,
  ReceiptItemType,
  ReceiptState,
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
  const { receiptState, userState, friendState } = state;
  console.log([userState.data].concat(friendState.data));
  return {
    userAndFriends: [userState.data].concat(friendState.data),
    // people: userState.user.friends.concat(userState.user),
    receiptState,
    userState
  };
};

const connector = connect(
  mapStateToProps,
  {
    getReceipt,
    setReceiptName,
    setReceiptAmount,
    setReceiptDate,
    addReceiptUser,
    deleteReceiptUser,
    addReceiptItem,
    deleteReceiptItem,
    setReceiptItemName,
    setReceiptItemAmount,
    addReceiptItemUser,
    deleteReceiptItemUser,
    saveReceipt
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux &
  RouteComponentProps<MatchParams> & {
    receiptState?: ReceiptState;
  };

const ReceiptEditPageComponent = ({
  match,
  userAndFriends,
  userState,
  receiptState,
  getReceipt,
  setReceiptName,
  setReceiptAmount,
  setReceiptDate,
  addReceiptUser,
  deleteReceiptUser,
  addReceiptItem,
  deleteReceiptItem,
  setReceiptItemName,
  setReceiptItemAmount,
  addReceiptItemUser,
  deleteReceiptItemUser,
  saveReceipt
}: // getUser,
//people
Props) => {
  const blankUsers: UserType[] = [];
  const [run, setRun] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const [modalUsers, setModalUsers] = useState(blankUsers);
  const [modalAllUsers, setModalAllUsers] = useState(blankUsers);
  const [modalOnSelect, setModalOnSelect] = useState({
    onSelect: (user: UserType) => {}
  });

  const receipt_id = Number(match.params.id) || -1;

  if (run) {
    getReceipt(receipt_id);
    setRun(false);
  }

  const {
    id = -1,
    balances,
    name,
    amount,
    user,
    users,
    receipt_items,
    date
  }: ReceiptType = receiptState.data;

  const allUsers = users;

  const onHide = () => {
    setModalShow(false);
  };

  const setModal = (
    curUsers: UserType[],
    allUsers: UserType[],
    onSelect: (arg0: UserType) => void
  ) => {
    setModalOnSelect({
      onSelect
    });
    setModalUsers(curUsers);
    setModalAllUsers(allUsers);
    setModalShow(true);
  };

  const onSave = () => {
    saveReceipt(id, receiptState.data);
  };

  return (
    <>
      <UserSelectModal
        show={modalShow}
        title={"Users"}
        onHide={onHide}
        users={modalUsers}
        allUsers={modalAllUsers}
        onSelect={modalOnSelect.onSelect}
      />

      <div className="align-middle mb-3">
        <h5
          className="float-left m-0 p-0"
          style={{ display: "inline", lineHeight: "2rem" }}
        >
          Receipt Info
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
              handleTextChange={setReceiptDate}
            />
            <br />
          </>
        }
        prefix="*"
        variant="info"
        name={name}
        handleNameChange={(name: string) => {
          setReceiptName(name);
        }}
        amount={amount}
        handleAmountChange={setReceiptAmount}
        handleDeleteClick={() => {}}
        users={users}
        handleUserClick={() => {}}
        handleDeleteUserClick={(i: number) => {
          deleteReceiptUser(i);
        }}
        handleAddUserClick={() => {
          setModal(users, userAndFriends, user => {
            addReceiptUser(user);
          });
        }}
      />
      <div className="align-middle">
        <h5 className="float-left">Sub-expenses</h5>
        <span
          className="float-right text-primary"
          onClick={() => {
            addReceiptItem();
          }}
        >
          + Add Item
        </span>
      </div>
      <br />
      <h5 />
      <ListOrNoneComponent<ReceiptItemType>
        list={receipt_items}
        noneComponent={
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <span className="float-left text-secondary">None</span>
              </Card.Title>
            </Card.Body>
          </Card>
        }
        listComponent={({ name, amount, users }: ReceiptItemType, i = -1) => {
          return (
            <ExpenseCardComponent
              prefix="-"
              variant="danger"
              name={name}
              handleNameChange={(name: string) => {
                setReceiptItemName(name, i);
              }}
              amount={amount}
              handleAmountChange={(amount: number) => {
                setReceiptItemAmount(amount, i);
              }}
              users={users}
              handleDeleteClick={() => {
                deleteReceiptItem(i);
              }}
              handleUserClick={(i: number) => {}}
              handleDeleteUserClick={(j: number) => {
                deleteReceiptItemUser(i, j);
              }}
              handleAddUserClick={() => {
                setModal(users, allUsers, user => {
                  addReceiptItemUser(user, i);
                });
              }}
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

export const ReceiptEditPage = connector(ReceiptEditPageComponent);
