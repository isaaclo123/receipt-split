import {
  LoginAction,
  LoginState,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "../types/index";

import { initState } from "./index"

const initialState: LoginState = initState({
  username: "",
  password: "",
  token: "",
  login: false
});

export const loginReducer = (
  state: LoginState = initialState,
  action: LoginAction
): LoginState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { token } = action.payload;

      return {
        modified: true,
        error: false,
        data: Object.assign({}, state.data, {
          token,
          login: true
        }),
        errors: {}
      };
    case LOGIN_FAIL:
      return {
        modified: true,
        error: true,
        data: Object.assign({}, state.data, {
          token: "",
          login: false
        }),
        errors: action.payload
      };
    default:
      return state;
  }
};
