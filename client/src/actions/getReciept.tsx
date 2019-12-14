import { Dispatch } from 'redux';

import {
  RecieptRequestAction,
  RecieptData
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

export const getRecieptList = () => (dispatch: Dispatch) => {
  const action = {
    type: 'RECIEPT_LIST_REQUEST',
  }

  console.log("GETRECIEPTLIST")

  dispatch(action)
}

export const getReciept = (payload: RecieptData) => (dispatch: Dispatch) => {
  console.log("getReciept")
  console.log(payload)
  const action: RecieptRequestAction = {
    type: 'RECIEPT_ID_REQUEST',
    payload
  }

  dispatch(action)
}
