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
  dispatch({
    type: 'SET_LOGIN',
    payload
  })
}
