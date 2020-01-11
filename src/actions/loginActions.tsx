import { fetchLogin, fetchSignup } from "../api/index";
import {
  ApiMiddlewareAction,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LoginPayload,
  SignupPayload
} from "../types/index";
import { apiCallAction } from "./index";

export const setLogin = (payload: LoginPayload): ApiMiddlewareAction =>
  apiCallAction({
    successType: LOGIN_SUCCESS,
    failType: LOGIN_FAIL,
    withToken: false,
    apiCall: fetchLogin,
    apiCallArgs: [payload],
    onSuccess: ({ access_token = "" }: any) => {
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
