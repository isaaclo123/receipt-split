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

  active: bool;
}

export const BalanceListItemComponent = ({
  prefix,
  amount,
  variant,
  name,
  descriptor,
  pending,
  handleClick,
  buttons
}: BalanceProps) => {
  return (
    <ListGroup.Item style={{
        lineHeight: "2rem"
      }}>

      <span>
        <span class={`text-${variant}`}>{prefix}${amount.toFixed(2)}</span>
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

      <span class="text-danger float-right">
        <ButtonGroup size="sm">
          {buttons.map(({ active, variant, text, handleButtonClick}: ButtonProps) => {
            return active ? (
              <Button
                variant={variant}
                onClick={() => handleClick()}
                active>
                {text}
              </Button>
              ) : (
              <Button
                variant={variant}
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
