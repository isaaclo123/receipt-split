import { Dispatch } from 'redux';

export interface LoginData {
  username:string;
  password:string;
}

export interface LoginAction {
  type: string;
  payload: LoginData;
}

export const setLogin = (payload: LoginData) => (dispatch: Dispatch) => {
  const loginAction: LoginAction = {
    type: 'SET_LOGIN',
    payload
  }

  dispatch(loginAction)
}
