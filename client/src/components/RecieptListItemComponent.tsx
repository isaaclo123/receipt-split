import React from 'react'

import {
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

import {
  ButtonProps,
} from '../types/index';

export interface RecieptProps {
  amount: number,
  name: string,
  pending: boolean,
  handleNameClick: () => void,
  handleViewClick: () => void,
}

export const RecieptListItemComponent = ({
  amount,
  name,
  pending,

  handleNameClick,
  handleViewClick,
}: RecieptProps) => {
  const buttons: ButtonProps[] = pending ? [{
      variant: "success",
      text: "RESOLVED",
      handleClick: handleViewClick
    }] : [{
      variant: "danger",
      text: "UNRESOLVED",
      handleClick: handleViewClick

  }]

  const balanceProps: BalanceProps = {
    prefix: "*",
    variant: "info",
    amount,
    descriptor: "at",
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
