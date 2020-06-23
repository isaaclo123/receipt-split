import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import { BadgeListComponent } from './BadgeListComponent'
import { UserType } from '../types/index'

export interface ExpenseCardParams {
  variant?: string;
  prefix?: string;

  name: string;
  nameError?: string;
  handleNameChange: (arg0:string) => void;

  amount: number;
  amountError?: string;
  handleAmountChange: (arg0:number) => void;

  handleDeleteClick: () => void;

  users: UserType[];

  handleUserClick: (arg0:number) => void;
  handleDeleteUserClick: (arg0:number) => void;
  handleAddUserClick: () => void;

  extraComponent?: React.ReactNode;
}

export const ExpenseCardComponent = ({
  name,
  nameError,
  handleNameChange,
  amount = 0,
  amountError,
  handleAmountChange,
  users = [],

  handleUserClick,
  handleDeleteUserClick,
  handleAddUserClick,

  extraComponent = null,

  variant = "info",
  prefix = "",

  handleDeleteClick
}: ExpenseCardParams) => {

  const [editing, setEditing] = useState(false);

  const inputStyle: React.CSSProperties = {
    height: "1.5em",
    border: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form>
          <Form.Row className="mb-0">
            <Form.Group as={Col} xs="8" sm="9" className="mb-0 pr-0" style={{
              minWidth: 0
              }}>
              <Form.Control
                style={inputStyle}
                plaintext
                className="form-control-lg"
                value={name}
                isInvalid={nameError != null}
                type="text"
                onChange={event => {
                  handleNameChange(event.currentTarget.value);
                }}
              />
              <Form.Control.Feedback type="invalid">
                {nameError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs="4" sm="3" className="mb-0 pl-0" style={{
              minWidth: 0,
              }}>
              {(!editing) ?
                (<Form.Control
                    style={Object.assign({}, inputStyle, { textAlign: "right" })}
                    plaintext
                    className={`text-${variant} form-control-lg`}
                    readOnly
                    value={`${prefix}$` + ((amount != null) ? amount.toFixed(2): "0.00")}
                    isInvalid={amountError != null}
                    onFocus = {() => {
                      setEditing(true);
                    }} />) :
                  (<Form.Control
                      style={Object.assign({}, inputStyle, { textAlign: "right" })}
                      plaintext
                      className={`text-${variant} form-control-lg`}
                      type="number"
                      step={0.01}
                      min={0}
                      readOnly={!editing}
                      isInvalid={amountError != null}
                      value={(amount != null) ? amount.toFixed(2): "0.00"}
                      onChange={event => {
                        // to decimal number
                        const value = Number(Number(event.currentTarget.value).toFixed(2))
                        handleAmountChange(value)
                      }}
                      onBlur = {() => {
                        setEditing(false);
                      }} />)
              }

              <Form.Control.Feedback
                className="text-right"
                type="invalid">
                {amountError}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
        </Form>

        <div>
          {extraComponent}
          <span className="float-left">
            <span className="align-middle">
              With&nbsp;
            </span>

            <BadgeListComponent
              items={users.map((user: UserType) => {
                const { fullname="" } = user
                return fullname
              })}
              handleItemClick={handleUserClick}
              handleDeleteClick={handleDeleteUserClick}
              handleAddClick={handleAddUserClick} />
          </span>
          <span className="float-right">
            <Button
              variant="outline-light"
              className="close"
              onClick={handleDeleteClick}>
              &times;
            </Button>
          </span>
        </div>
      </Card.Body>
    </Card>
  )
}
