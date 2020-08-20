import {
  LoginAction,
  LoginState,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "../types/index";

import { initState } from "./index"
import { storeToken, removeToken, initApiFetcher } from "../api";

const initialState: LoginState = initState({
  username: "",
  password: "",
  login: false
});

export const loginReducer = (
  state: LoginState = initialState,
  action: LoginAction
): LoginState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { token } = action.payload;

      storeToken(token);

      return {
        modified: true,
        error: false,
        data: Object.assign({}, state.data, {
          password: "",
          login: true
        }),
        errors: {}
      };
    case LOGIN_FAIL:
      initApiFetcher();
      removeToken();

      return {
        modified: true,
        error: true,
        data: Object.assign({}, state.data, {
          login: false
        }),
        errors: action.payload
      };
    default:
      return state;
  }
};
