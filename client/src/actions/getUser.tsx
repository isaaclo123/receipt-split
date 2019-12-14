import { Dispatch } from 'redux';

import {
  UserRequestAction
} from '../types/index'

export const getUser = () => (dispatch: Dispatch) => {
  const action: UserRequestAction = {
    type: 'USER_INFO_REQUEST',
  }

  console.log('GETUSER')

  dispatch(action)
}
