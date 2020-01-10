import {
  UserAction,
  UserState,
  USER_INFO_SUCCESS,
  USER_INFO_FAIL
} from "../types/index";

import { getDataReducer } from "./index";

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
  return getDataReducer(USER_INFO_SUCCESS, USER_INFO_FAIL, state)(
    state,
    action
  );
};
