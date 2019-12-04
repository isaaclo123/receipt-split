import React from 'react'

import {
  ButtonProps,
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

export interface LeaveProps {
  amount: number,
  name: string,
  pending: boolean,
  handleNameClick: () => void,
  handlePayClick: () => void,
}

export const LeaveListItemComponent = ({
  amount,
  name,
  pending,

  handleNameClick,
  handlePayClick,
}: LeaveProps) => {
  const buttons: ButtonProps[] = pending ? [{
      variant: "primary",
      text: "MARK PAID",
      handleClick: handlePayClick
    }] : [{
      variant: "secondary",
      text: "PENDING",
      handleClick: handlePayClick

  }]

  const balanceProps: BalanceProps = {
    prefix: "-",
    variant: "danger",
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
