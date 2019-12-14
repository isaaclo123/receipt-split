import { Dispatch } from 'redux';

import {
  RecieptAction,
  RecieptData
} from '../types/index'

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
  const action: RecieptAction = {
    type: 'GET_RECIEPT_FROM_ID',
    payload
  }

  dispatch(action)
}
