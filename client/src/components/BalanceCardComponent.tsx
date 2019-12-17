import React from 'react'

import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import ListGroup from 'react-bootstrap/ListGroup';

import { TakeProps, TakeListItemComponent } from './TakeListItemComponent';
import { LeaveProps, LeaveListItemComponent } from './LeaveListItemComponent';

import { ButtonProps, BalanceType } from '../types/index';

import { List } from 'immutable'

import {
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

export interface BalanceCardProps {
  name: string;
  amount: number;
  items: List<BalanceType>;

  color: string;
  prefix: string;

  topButton: ButtonProps;
  listButton: ButtonProps;
}

export const BalanceCardComponent = ({
  name,
  amount,
  color,

  prefix,
  items,

  topButton,
  listButton
}: BalanceCardProps) => {

  const balanceRender = (items: List<BalanceType>) => {
    return items.map(({
        id = -1,
        to_user,
        from_user,
        to_user_id = -1,
        from_user_id = -1,
        amount,
        reciept
      }: BalanceType) => {

        const props: BalanceProps = {
          active: true,
          variant: color,
          prefix,
          descriptor: "for",
          name: (reciept == null) ? "Unknown" : reciept.name,
          handleClick: () => {},
          buttons: [listButton],
          amount,
        }

        return (
          <BalanceListItemComponent
            {...props}/>
        )
      })
  }

  return (
    <Card>
      <Card.Header
        style={{
          lineHeight: "2rem"
        }}>
        <span className="float-left">
          <a href="#">{name}</a>
        </span>
        <span className="float-right">
          <Button
            className={`text-${topButton.variant}`}
            size="sm"
            onClick={() => topButton.handleClick()}>
            {topButton.text}
          </Button>
        </span>
        <br />
      </Card.Header>

      <Card.Body className={`text-center text-${color}`}>
        <h1
          style={{
            padding: 0,
            margin: 0,
            display: "inline-block"
          }}>
          {prefix}${amount.toFixed(2)}
        </h1>
      </Card.Body>

        <hr style={{
            padding: 0,
            margin: 0,
          }} />

      <ListGroup className="list-group-flush">
        <Button
          className={`text-${listButton.variant}`}
          size="sm"
          onClick={() => listButton.handleClick()}>
          {listButton.text}
        </Button>

        {balanceRender(items)}
      </ListGroup>
    </Card>
  )
}
