import React, { useState } from "react";

import { get } from "./index";
import { connect, ConnectedProps } from "react-redux";

// import { getUser } from "../actions/getUser";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
  UserType,
  BalanceType,
  RootState,
  Dict,
  CURRENCY_FORMAT
} from "../types/index";

import {
  UserSelectModal,
  DeleteModal,
  ExpenseCardComponent,
} from "./index";

import NumberFormat, { NumberFormatValues } from 'react-number-format';

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
    date,
    resolved
  }: ReceiptType = receiptState.data;

  // const error = receiptState.error;
  const modified = receiptState.modified;

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
    deleteReceipt(id, () => {
      // success
      console.log("success onDelete")
      setDeleteShow(false);
      history.goBack();
    }, () => {
      console.log("fail onDelete")
      setDeleteShow(false);
    });
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

      <Row className="mb-2">
        <Col>
          <h5
            className="float-left m-0 p-0"
            style={{ display: "inline", lineHeight: "2rem" }}
          >
            Receipt Info
            {
              resolved &&
              <span className="text-success">
                &nbsp;[RESOLVED!]
              </span>
            }
          </h5>
        </Col>
        <Col xs="auto">
          <Button
            size="sm"
            className="float-right"
            onClick={() => {
              onSave();
            }}
            disabled={!modified}
          >
            { modified ? "SAVE" : "SAVED" }
          </Button>
        </Col>
      </Row>

      { ("error" in errors) &&
        <Row>
          <Col>
            <Alert variant="danger">
              {errors.error}
            </Alert>
          </Col>
        </Row>}

      <Row>
        <Col>
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
                    <NumberFormat
                      className="pb-0"
                      value={date}
                      format="####-##-##"
                      onValueChange={({formattedValue = ""}: NumberFormatValues) => {
                          setReceiptDate(formattedValue);
                      }}
                      plaintext
                      isInvalid={errors.date != null}

                      customInput={Form.Control} />
                      <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                    </Form.Group>
                  </InputGroup>
              </>
            }
            prefix="*"
            variant="info"
            placeholder = "Enter Receipt Name"

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
        </Col>
      </Row>

      <Row>
        <Col>
          <h5 className="float-left">Sub-expenses</h5>
        </Col>
        <Col>
          <Button
            variant="link"
            className="m-0 p-0 float-right"
            onClick={() => {
              addReceiptItem();
            }}>
            + Add Item
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <ListOrNoneComponent<ReceiptItemType>
            list={receipt_items}
            noneComponent={noneComponent}
            listComponent={({ name, amount, users }: ReceiptItemType, i = -1) => {
              return (
                <ExpenseCardComponent
                  prefix="-"
                  variant="info"
                  placeholder = "Enter Receipt Item Name"

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
        </Col>
      </Row>

      <Row>
        <Col>
          <h5>Balance</h5>
        </Col>
      </Row>
          <ListOrNoneComponent
            list={balances}
            noneComponent={noneComponent}
            listComponent={({ to_user, from_user, amount, paid }: BalanceType) => {
              return (
                <Row>
                  <Col>
                    <Card className="mb-3">
                      <Card.Body>
                        <Card.Title>
                          <span className="float-left">
                            <span className="text-primary">{from_user.fullname}</span>
                            &nbsp;pays&nbsp;
                            <span className="text-primary">{to_user.fullname}</span>
                          </span>
                          <span className="float-right">
                            <span className={`
                              ${
                                paid ? "text-success": "text-danger"
                              }`}>
                              {
                                paid ? "(PAID)" : null
                              }&nbsp;
                              <NumberFormat
                                displayType="text"
                                value={amount}
                                prefix="$"
                                {...CURRENCY_FORMAT}/>
                            </span>
                          </span>
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              );
            }}
          />
    </>
  );
};

export const ReceiptEditPage = connector(ReceiptEditPageComponent);
