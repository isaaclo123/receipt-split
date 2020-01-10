import { fetchLogin } from "../api/index";
import {
  ApiMiddlewareAction,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LoginPayload
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
