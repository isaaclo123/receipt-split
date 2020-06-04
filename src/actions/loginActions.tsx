import { fetchLogin, fetchSignup } from "../api/index";
import { TOKEN_LOCALSTORAGE } from "../types/index";
import {
  ApiMiddlewareAction,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LoginPayload,
  SignupPayload
} from "../types/index";
import { apiCallAction } from "./index";
// import { disconnect } from "cluster";

export const deleteToken = () => (dispatch: any) => {
  localStorage.removeItem(TOKEN_LOCALSTORAGE);

  return dispatch({
    type: LOGIN_FAIL,
    payload: {
      token: ""
    }
  })
}

export const setToken = () => (dispatch: any) => {
  // TODO have verification of token
  const token = localStorage.getItem(TOKEN_LOCALSTORAGE);

  if (token !== "" && token != null) {
    return dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token
      }
    })
  }
}

export const setLogin = (payload: LoginPayload): ApiMiddlewareAction =>
  apiCallAction({
    successType: LOGIN_SUCCESS,
    failType: LOGIN_FAIL,
    withToken: false,
    apiCall: fetchLogin,
    apiCallArgs: [payload],
    onSuccess: ({ access_token = "" }: any) => {
      localStorage.setItem(TOKEN_LOCALSTORAGE, access_token)
      return {
        token: access_token
      };
    }
  });

export const setSignup = (payload: SignupPayload): ApiMiddlewareAction =>
  apiCallAction({
    failType: LOGIN_FAIL,
    withToken: false,
    apiCall: fetchSignup,
    apiCallArgs: [payload],

    afterSuccess: setLogin({
      username: payload.username,
      password: payload.password
    })
  });
