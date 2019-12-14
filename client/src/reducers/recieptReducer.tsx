import {
  RecieptData,
  RecieptAction,
  RecieptState,
} from '../types/index'

export const initialReciept = {
  "date": "2019-03-02",
  "reciept_items": [],
  "users": [],
  "amount": 0,
  "balances": [],
  "user": {
    "username": "test",
    "id": 1,
    "fullname": "isaac lo"
  },
  "name": "New Reciept"
}

const initialState: RecieptState = {
  reciept: null,
}

export default (state:RecieptState = initialState, {
  payload,
  type
}: RecieptAction) => {
  if (payload == null) {
    return state
  }

  // const { reciept }: RecieptState = payload

  // alert(username)
  // console.log(username)
  // console.log(password)

  switch (type) {
    case 'RECIEPT_ID_SUCCESS':
      return payload
    case 'RECIEPT_ID_FAIL':
      return payload
    default:
      return state;
  }
}
