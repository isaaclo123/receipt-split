import React, { useState } from "react";

import { connect, ConnectedProps } from "react-redux";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import NumberFormat, { NumberFormatValues } from 'react-number-format';

import {
  setPaymentName,
  setPaymentAmount,
  setPaymentMessage,
  setPaymentUser,
  addFriend,
  setNewPayment
} from "../actions/index";

import {
  RootState,
  UserType
} from "../types/index";

import {
  UserSelectModal
} from "./index"

const mapStateToProps = (state: RootState) => {
  const { paymentState } = state;
  return { paymentState };
};

const connector = connect(
  mapStateToProps,
  {
    setNewPayment,
    addFriend,
    setPaymentName,
    setPaymentAmount,
    setPaymentMessage,
    setPaymentUser,
  }
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export type PaymentModalProps = PropsFromRedux & {
  show: boolean;
  onClose: () => void;
};

const PayModalComponent = ({
  paymentState,
  show,
  onClose,

  setPaymentName,
  setPaymentAmount,
  setPaymentMessage,
  setPaymentUser,
  setNewPayment,
}: PaymentModalProps) => {
  const errors = (paymentState.errors != null) ? paymentState.errors : {};

  const {
    amount = 0.0,
    to_user = {
      id: -1,
      username: "",
      fullname: ""
    },
    message = "",
  } = paymentState.data;

  return (
    <>

      <Modal
        show={show}
        onHide={onClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Pay <span className="text-primary">{to_user.fullname}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { ("error" in errors) &&
            <Alert variant="danger">
              {errors.error}
            </Alert>
          }

          <Form className="mb-3">
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <NumberFormat
                  allowLeadingZeros={false}
                  value={amount}
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  onValueChange={({floatValue = 0.0}: NumberFormatValues) => {
                      setPaymentAmount(floatValue);
                  }}
                  isInvalid={"amount" in errors}
                  customInput={Form.Control} />

              <Form.Control.Feedback type="invalid">
                {errors.amount}
              </Form.Control.Feedback>
            </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPaymentMessage(event.currentTarget.value);
                }}
                isInvalid={"message" in errors}
                value={message}
              />
              <Form.Control.Feedback type="invalid">
                {errors.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              console.log("Set New Payment")
              console.log(paymentState.data)
              setNewPayment(paymentState.data);
            }}
          >
            Pay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const PayModal = connector(PayModalComponent);
