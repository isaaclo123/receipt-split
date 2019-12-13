import { Dispatch } from 'redux';

import { LoginData, LoginAction } from '../types/index'

export const setLogin = (payload: LoginData) => (dispatch: Dispatch) => {
  const loginAction: LoginAction = {
    type: 'LOGIN_REQUEST',
    payload
  }

  dispatch(loginAction)
}
