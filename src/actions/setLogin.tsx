import { Dispatch } from "redux";

import { fetchLogin } from "../api/index";

import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  TokenData,
  LoginData,
  LoginAction
} from "../types/index";

export const setLogin = (payload: LoginData) => async (dispatch: Dispatch) => {
  const result = await fetchLogin(payload);

  if (!result || !result.access_token) {
    const action: LoginAction = {
      type: LOGIN_FAIL,
      payload: null
    };

    dispatch(action);
  }

  const { username } = payload;

  const tokenPayload: TokenData = {
    username,
    token: result.access_token
  };

  const action: LoginAction = {
    type: LOGIN_SUCCESS,
    payload: tokenPayload
  };

  dispatch(action);
};
