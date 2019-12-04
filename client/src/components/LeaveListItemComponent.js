import React from 'react'

import {
  ButtonProps,
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

export interface LeaveProps {
  amount: number,
  name: string,
  pending: bool,
  handleNameClick: () => void,
  handlePayClick: () => void,
}

export const LeaveListItemComponent = ({
  amount,
  name,
  pending,

  handleNameClick,
  handleAcceptClick,
  handleRejectClick,
}: LeaveProps) => {
  const buttons: ButtonProps[] = [
    {
      variant: "success",
      text: "ACCEPT",
      handleClick: handleAcceptClick
    }, {
      variant: "danger",
      text: "REJECT",
      handleClick: handleRejectClick
    },
  ]

  const balanceProps: BalanceProps = {
    prefix: "-",
    variant: "danger",
    amount,
    descriptor: "to",
    name,
    handleAcceptClick,
    handleRejectClick,
    buttons,
    active: pending // TODO
  }

  return (
    <BalanceListItemComponent
      {...balanceProps}/>
  )
}
