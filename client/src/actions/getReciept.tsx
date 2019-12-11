import { Dispatch } from 'redux';

import {
  RecieptAction,
  RecieptData
} from '../types/index'

export const getReciept = (payload: RecieptData) => (dispatch: Dispatch) => {
  console.log("getReciept")
  console.log(payload)
  const action: RecieptAction = {
    type: 'GET_RECIEPT_FROM_ID',
    payload
  }

  dispatch(action)
}
