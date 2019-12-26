import {
  LoginAction,
  LoginState,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "../types/index";

const initialState: LoginState = {
  username: "",
  login: false,
  token: null
};

export default (
  state: LoginState = initialState,
  action: LoginAction
): LoginState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { username, token } = action.payload;
      return {
        username,
        login: true,
        token
      };
    case LOGIN_FAIL:
      return {
        username: "",
        login: false,
        token: null
      };
    default:
      return state;
  }
};
