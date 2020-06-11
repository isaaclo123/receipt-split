import React from 'react'

import {
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

import {
  ButtonProps,
  ReceiptSummaryType
} from '../types/index';

export interface ReceiptProps extends ReceiptSummaryType {
  handleNameClick?: () => void,
  handleViewClick?: () => void,
}

export const ReceiptListItemComponent = ({
  amount,
  name,
  resolved,

  handleNameClick = () => {},
  handleViewClick = () => {},
}: ReceiptProps) => {
  // const buttons: ButtonProps[] = pending ? [{
  //     variant: "success",
  //     text: "RESOLVED",
  //     handleClick: handleViewClick
  //   }] : [{
  //     variant: "danger",
  //     text: "UNRESOLVED",
  //     handleClick: handleViewClick

  // }]
  const buttons: ButtonProps[] = []

  const balanceProps: BalanceProps = {
    prefix: "*",
    variant: "info",
    amount,
    descriptor: "at",
    name,
    handleClick: handleNameClick,
    buttons,
    active: resolved// TODO
  }

  return (
    <BalanceListItemComponent
      {...balanceProps}/>
  )
}
