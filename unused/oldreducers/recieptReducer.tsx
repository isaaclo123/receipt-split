import {
  ReceiptData,
  ReceiptAction,
  ReceiptState,
} from '../types/index'

export const initialReceipt = {
  "date": "2019-03-02",
  "receipt_items": [],
  "users": [],
  "amount": 0,
  "balances": [],
  "user": {
    "username": "test",
    "id": 1,
    "fullname": "isaac lo"
  },
  "name": "New Receipt"
}

const initialState: ReceiptState = {
  receipt: null,
}

export default (state:ReceiptState = initialState, {
  payload,
  type
}: ReceiptAction) => {
  if (payload == null) {
    return state
  }

  // alert(username)
  // console.log(username)
  // console.log(password)

  switch (type) {
    case 'RECIEPT_SAVE_SUCCESS':
      return payload
    case 'RECIEPT_SAVE_FAIL':
      return state

    case 'RECIEPT_SET':
      console.log("RECIEPTSET")
      console.log(payload)
      return payload
    case 'RECIEPT_ID_SUCCESS':
      return payload
    case 'RECIEPT_ID_FAIL':
      return payload
    default:
      return state;
  }
}
