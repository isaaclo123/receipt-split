import { Dispatch } from "redux";

import { fetchLogin } from "../api/index";

import { LOGIN_FAIL, LOGIN_SUCCESS, LoginPayload } from "../types/index";

export const setLogin = (payload: LoginPayload) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await fetchLogin(payload);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: result.access_token
      }
    });
  } catch (e) {
    dispatch({
      type: LOGIN_FAIL,
      payload: {} // TODO
    });
  }
};
