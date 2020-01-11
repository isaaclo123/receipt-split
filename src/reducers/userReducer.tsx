import {
  UserAction,
  UserState,
  USER_INFO_SUCCESS,
  USER_INFO_FAIL
} from "../types/index";

import { setDataReducer } from "./index";

const initialState: UserState = {
  error: false,
  data: {
    id: -1,
    username: "",
    fullname: ""
  },
  errors: {}
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  return setDataReducer({
    successType: USER_INFO_SUCCESS,
    failType: USER_INFO_FAIL,
    initialState: state
  })(state, action);
};
