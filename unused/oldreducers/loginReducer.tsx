import {
  LoginAction,
  LoginState,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "../types/index";

const initialState: LoginState = {
  error: false,
  data: {
    username: "",
    password: "",
    token: null,
    login: false
  },
  errors: {}
};

export default (
  state: LoginState = initialState,
  action: LoginAction
): LoginState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { token } = action.payload;

      return {
        error: false,
        data: Object.assign({}, state.data, {
          token,
          login: false
        }),
        errors: {}
      };
    case LOGIN_FAIL:
      return {
        error: true,
        data: Object.assign({}, state.data, {
          token: null,
          login: false
        }),
        errors: action.payload
      };
    default:
      return state;
  }
};
