import React from 'react'

import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

export interface ButtonProps {
  variant: string;
  text: string;
  handleClick: () => void;
}

export interface BalanceProps {
  prefix: string;
  amount: number;

  variant: string;
  descriptor: string;

  name: string;
  handleClick: () => void;

  buttons: ButtonProps[];

  active: boolean;
}

export const BalanceListItemComponent = ({
  prefix,
  amount,
  variant,
  name,
  descriptor,
  handleClick,
  buttons,
  active
}: BalanceProps) => {
  return (
    <ListGroup.Item style={{
        lineHeight: "2rem"
      }}>

      <span>
        <span className={`text-${variant}`}>{prefix}${amount.toFixed(2)}</span>
        &nbsp;{descriptor}&nbsp;
        <Button
          variant="link"
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0
          }}
          onClick={() => handleClick()}>
          {name}
        </Button>
      </span>

      <span className="text-danger float-right">
        <ButtonGroup size="sm">
          {buttons.map(({ variant, text, handleClick}: ButtonProps) => {
            return active ? (
              <Button
                color={variant}
                onClick={() => handleClick()}
                active>
                {text}
              </Button>
              ) : (
              <Button
                color={variant}
                onClick={() => handleClick()}
                disabled>
                {text}
              </Button>
              )
          })
        }
        </ButtonGroup>
      </span>
    </ListGroup.Item>
  )
}
