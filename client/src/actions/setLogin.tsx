import { Dispatch } from 'redux';

import { LoginData, LoginAction } from '../types/index'

export const setLogin = (payload: LoginData) => (dispatch: Dispatch) => {
  const loginAction: LoginAction = {
    type: 'SET_LOGIN',
    payload
  }

  dispatch(loginAction)
}
