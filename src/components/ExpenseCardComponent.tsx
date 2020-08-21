import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

import NumberFormat, { NumberFormatValues } from 'react-number-format';

import { BadgeListComponent } from './BadgeListComponent'
import { UserType, CURRENCY_FORMAT } from '../types/index'

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

  placeholder?: string
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
  placeholder = "",

  handleDeleteClick
}: ExpenseCardParams) => {

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
            <Form.Group as={Col} className="mb-0 pr-0" style={{
              minWidth: 0
              }}>
              <Form.Control
                style={inputStyle}
                placeholder={placeholder}
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

            <Form.Group as={Col} xs="auto" className="mb-0 pl-0" style={{
              minWidth: 0,
              }}>

              <NumberFormat
                style={Object.assign({}, inputStyle, { textAlign: "right" })}
                plaintext
                className={`text-${variant} form-control-lg`}
                value={amount}
                prefix={`${prefix}$`}
                onValueChange={({floatValue = 0}: NumberFormatValues) => {
                  console.log(Math.abs(floatValue))
                  handleAmountChange(Math.abs(floatValue));
                }}
                isInvalid={amountError != null}
                customInput={Form.Control}
                {...CURRENCY_FORMAT}/>

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
