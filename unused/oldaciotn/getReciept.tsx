import { Dispatch } from 'redux';

import {
  ReceiptRequestAction,
  ReceiptData
} from '../types/index'

// export const setReceiptList = () => (dispatch: Dispatch) => {
//   const action = {
//     type: 'RECIEPT_LIST_REQUEST',
//   }
//
//   console.log("GETRECIEPTLIST")
//
//   dispatch(action)
// }

export const getReceiptList = () => (dispatch: Dispatch) => {
  const action = {
    type: 'RECIEPT_LIST_REQUEST',
  }

  console.log("GETRECIEPTLIST")

  dispatch(action)
}

export const getReceipt = (payload: ReceiptData) => (dispatch: Dispatch) => {
  console.log("getReceipt")
  console.log(payload)
  const action: ReceiptRequestAction = {
    type: 'RECIEPT_ID_REQUEST',
    payload
  }

  dispatch(action)
}
