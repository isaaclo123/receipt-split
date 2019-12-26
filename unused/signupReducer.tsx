import {
  SignupAction,
  SignupState,
  SignupData,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL
} from "../types/index";

const initialState: SignupState = {
  username: "",
  password: "",
  fullname: "",
  signed_up: false
};

export default (state: SignupState = initialState, action: SignupAction) => {
  switch (action.type) {
    case SIGNUP_SUCCESS:
      const { username, password, fullname }: SignupData = action.payload;

      return {
        username,
        password,
        fullname,
        signed_up: true
      };

    case SIGNUP_FAIL:
      return {
        username,
        password,
        fullname,
        signed_up: false
      };

    default:
      return state;
  }
};
