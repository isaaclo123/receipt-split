import React, { useState } from "react";

import { get } from "./index";
import { connect, ConnectedProps } from "react-redux";

// import { getUser } from "../actions/getUser";

import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { RouteComponentProps } from "react-router-dom";

import { ListOrNoneComponent } from "./index";

import {
  getReceipt,
  setReceiptName,
  setReceiptAmount,
  setReceiptDate,
  addReceiptUser,
  addReceiptItem,
  deleteReceipt,
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
  RootState,
  Dict
} from "../types/index";

import {
  UserSelectModal,
  DeleteModal,
  ExpenseCardComponent,
} from "./index";

type MatchParams = {
  id: string;
};

const mapStateToProps = (state: RootState) => {
  const { receiptState, userState, friendState } = state;
  console.log([userState.data].concat(friendState.data.friends));
  return {
    userAndFriends: [userState.data].concat(friendState.data.friends),
    // people: userState.user.friends.concat(userState.user),
    receiptState,
    userState
  };
};

const connector = connect(
  mapStateToProps,
  {
    deleteReceipt,
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

type Props = PropsFromRedux & RouteComponentProps<MatchParams>;

const ReceiptEditPageComponent = ({
  match,
  history,
  userAndFriends,
  userState,
  receiptState,
  getReceipt,
  setReceiptName,
  setReceiptAmount,
  setReceiptDate,
  addReceiptUser,
  deleteReceipt,
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

  const [deleteShow, setDeleteShow] = useState(false);

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

  // const error = receiptState.error;
  const errors = (receiptState.errors != null) ? receiptState.errors : {};

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

  const onDeleteHide = () => {
    setDeleteShow(false);
  }

  const onDelete = () => {
    deleteReceipt(id);
    setDeleteShow(false);
    history.goBack();
  }

  const noneComponent = (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <span className="float-left text-secondary">None</span>
        </Card.Title>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <DeleteModal
        hide={!deleteShow}
        name={name}
        onClose={onDeleteHide}
        onDelete={onDelete}
      />

      <UserSelectModal
        show={modalShow}
        title="Users"
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

      { ("error" in errors) ?
        <Alert variant="danger">
          {errors.error}
        </Alert>
      : <></>}

      <ExpenseCardComponent
        extraComponent={
          <>
            <InputGroup>
              <Form.Label
                className="col-form-label">
                Paid by{" "}
                <span className="text-primary">
                  {user == null ? "Unknown" : user.fullname}
                </span>{" "}
                on&nbsp; </Form.Label>
              <Form.Group className="mb-0">
                <Form.Control
                  className="pb-0"
                  isInvalid={errors.date != null}
                  plaintext
                  value={date}
                  type="text"
                  onChange={event => {
                    setReceiptDate(event.currentTarget.value);
                  }} />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>
              </InputGroup>
          </>
        }
        prefix="*"
        variant="info"

        name={name}
        nameError={errors.name}
        handleNameChange={(name: string) => {
          setReceiptName(name);
        }}

        amount={amount}
        amountError={errors.amount}
        handleAmountChange={setReceiptAmount}

        handleDeleteClick={() => {setDeleteShow(true)}}
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
      <div>
        <h5 className="float-left">Sub-expenses</h5>
        <span
          className="float-right text-primary"
          onClick={() => {
            addReceiptItem();
          }}>
          + Add Item
        </span>
      </div>
      <br />
      <h5 />
      <ListOrNoneComponent<ReceiptItemType>
        list={receipt_items}
        noneComponent={noneComponent}
        listComponent={({ name, amount, users }: ReceiptItemType, i = -1) => {
          return (
            <ExpenseCardComponent
              prefix="-"
              variant="danger"

              name={name}
              handleNameChange={(name: string) => {
                setReceiptItemName(name, i);
              }}
              nameError={get<Dict, string, number, string>(errors, "receipt_items", i, "name")}

              amount={amount}
              amountError={get<Dict, string, number, string>(errors, "receipt_items", i, "amount")}

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
        noneComponent={noneComponent}
        listComponent={({ to_user, from_user, amount, paid }: BalanceType) => {
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
                    {paid && (<b>(PAID) </b>)}

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
