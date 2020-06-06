import { Dispatch } from 'redux';

import {
  ReceiptRequestAction,
  ReceiptData
} from '../types/index'

// export const setReceiptList = () => (dispatch: Dispatch) => {
//   const action = {
//     type: 'RECEIPT_LIST_REQUEST',
//   }
//
//   console.log("GETRECEIPTLIST")
//
//   dispatch(action)
// }

export const getReceiptList = () => (dispatch: Dispatch) => {
  const action = {
    type: 'RECEIPT_LIST_REQUEST',
  }

  console.log("GETRECEIPTLIST")

  dispatch(action)
}

export const getReceipt = (payload: ReceiptData) => (dispatch: Dispatch) => {
  console.log("getReceipt")
  console.log(payload)
  const action: ReceiptRequestAction = {
    type: 'RECEIPT_ID_REQUEST',
    payload
  }

  dispatch(action)
}
