import { Dispatch } from 'redux';

import {
  RecieptAction,
  RecieptType
} from '../types/index'

// export const setRecieptList = () => (dispatch: Dispatch) => {
//   const action = {
//     type: 'RECIEPT_LIST_REQUEST',
//   }
//
//   console.log("GETRECIEPTLIST")
//
//   dispatch(action)
// }

export const setReciept = (payload: RecieptType) => (dispatch: Dispatch) => {
  console.log("setReciept")
  console.log(payload)
  const action: RecieptAction = {
    type: 'RECIEPT_SET',
    payload: {
      reciept: payload
    }
  }

  dispatch(action)
}
