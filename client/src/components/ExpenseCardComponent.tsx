import React from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { BadgeListProps, BadgeListComponent } from './BadgeListComponent'

import { TextInputComponent } from './TextInputComponent'

import { List } from 'immutable'

export interface ExpenseCardParams {
  variant?: string;
  prefix?: string;

  name: string;
  handleNameChange: (arg0:string) => void;

  amount: number;
  handleAmountChange: (arg0:number) => void;

  handleDeleteClick: () => void;

  users: List<string>;

  handleUserClick: (arg0:number) => void;
  handleDeleteUserClick: (arg0:number) => void;
  handleAddUserClick: () => void;

  extraComponent?: React.ReactNode;
}

export const ExpenseCardComponent = ({
  name,
  handleNameChange,
  amount,
  handleAmountChange,
  users,

  handleUserClick,
  handleDeleteUserClick,
  handleAddUserClick,

  extraComponent = null,

  variant = "info",
  prefix = "",

  handleDeleteClick
}: ExpenseCardParams) => {

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <span className="float-left">
            <TextInputComponent
              value={name}
              handleTextChange={handleNameChange}
              />
          </span>
          <span
            className={`text-${variant} float-right`}>
            {prefix}$
            <TextInputComponent
              value={amount.toFixed(2)}
              pattern="^(\d*\.)?\d+$"
              handleValidate={(str: string) => {
                // check greater than 0 and not invalid
                const value = Number(str)
                if (Number.isNaN(value)) return false
                return value > 0
              }}
              handleTextChange={(str: string) => {
                // to decimal number
                const value = Number(Number(str).toFixed(2))
                handleAmountChange(value)
              }}
              />
          </span>
          <br />
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
        </Card.Subtitle>
        <Card.Text>
          {extraComponent}
          <span className="float-left">
            <span className="align-middle">
              With&nbsp;
            </span>

            <BadgeListComponent
              items={users}
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
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
