import { Dispatch } from 'redux';

import {
  RecieptSetAction,
  RecieptType,
} from '../types/index'

export const saveReciept = (payload: RecieptType) => (dispatch: Dispatch) => {
  console.log("saveReciept")
  console.log(payload)
  const action: RecieptSetAction = {
    type: 'RECIEPT_SAVE_REQUEST',
    payload
  }

  dispatch(action)
}
