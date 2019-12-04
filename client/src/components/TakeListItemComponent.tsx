import React from 'react'

import {
  ButtonProps,
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

export interface TakeProps {
  amount: number,
  name: string,
  pending: boolean,
  handleNameClick: () => void,
  handlePayClick: () => void,
}

export const TakeListItemComponent = ({
  amount,
  name,
  pending,

  handleNameClick,
  handlePayClick,
}: TakeProps) => {
  const buttons: ButtonProps[] = [
    {
      variant: "primary",
      text: "MARK PAID",
      handleClick: handlePayClick
    },
  ]

  const balanceProps: BalanceProps = {
    prefix: "+",
    variant: "success",
    amount,
    descriptor: "from",
    name,
    handleClick: handleNameClick,
    buttons,
    active: pending // TODO
  }

  return (
    <BalanceListItemComponent
      {...balanceProps}/>
  )
}
