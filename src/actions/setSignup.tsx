import { Dispatch } from "redux";

import { LoginData, LoginAction, LOGIN_FAIL } from "../types/index";
import { setLogin } from "./index";
import { fetchSignup } from "../api/index";

export const setSignup = (payload: LoginData) => async (dispatch: Dispatch) => {
  const result = await fetchSignup(payload);

  if (!result) {
    const action: LoginAction = {
      type: LOGIN_FAIL,
      payload: null
    };

    dispatch(action);
  }

  const { username, password } = payload;

  const loginPayload: LoginData = {
    username,
    password
  };

  await setLogin(loginPayload)(dispatch);
};
