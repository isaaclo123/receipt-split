import React from 'react'

import {
  BalanceProps,
  BalanceListItemComponent
} from './BalanceListItemComponent';

import {
  ButtonProps
} from '../types/index'
import { inflate } from 'zlib';

export interface TakeProps {
  amount: number,
  name: string,
  pending: boolean,
  handleNameClick: () => void,
  handleAcceptClick: () => void,
  handleRejectClick: () => void,
}

export const TakeListItemComponent = ({
  amount,
  name,
  pending,

  handleNameClick,
  handleAcceptClick,
  handleRejectClick,
}: TakeProps) => {
  // const buttons: ButtonProps[] = [
  //   {
  //     variant: "success",
  //     text: "ACCEPT",
  //     handleClick: handleAcceptClick
  //   }, {
  //     variant: "danger",
  //     text: "REJECT",
  //     handleClick: handleRejectClick
  //   },
  // ]
  const buttons: ButtonProps[] = []

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
