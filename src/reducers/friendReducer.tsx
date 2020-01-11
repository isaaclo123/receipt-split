import {
  UserAction,
  UserState,
  FRIEND_LIST_SUCCESS,
  FRIEND_LIST_FAIL
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

export const friendReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  return setDataReducer({
    successType: FRIEND_LIST_SUCCESS,
    failType: FRIEND_LIST_FAIL,
    initialState: state
  })(state, action);
};
