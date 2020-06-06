import { Dispatch } from 'redux';

import {
  ReceiptSetAction,
  ReceiptType,
} from '../types/index'

export const saveReceipt = (payload: ReceiptType) => (dispatch: Dispatch) => {
  console.log("saveReceipt")
  console.log(payload)
  const action: ReceiptSetAction = {
    type: 'RECEIPT_SAVE_REQUEST',
    payload
  }

  dispatch(action)
}
