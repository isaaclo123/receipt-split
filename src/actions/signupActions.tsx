import { Dispatch } from "redux";

import { LoginPayload, SignupPayload, LOGIN_FAIL } from "../types/index";
import { setLogin } from "./index";
import { fetchSignup } from "../api/index";

export const setSignup = (payload: SignupPayload) => async (
  dispatch: Dispatch
) => {
  try {
    await fetchSignup(payload);

    const { username, password } = payload;

    const loginPayload: LoginPayload = {
      username,
      password
    };

    await setLogin(loginPayload)(dispatch);
  } catch (e) {
    dispatch({
      type: LOGIN_FAIL,
      payload: {} // TODO
    });
  }
};
