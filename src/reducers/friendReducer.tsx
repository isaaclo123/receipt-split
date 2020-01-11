import {
  UserAction,
  UserState,
  FRIEND_LIST_SUCCESS,
  FRIEND_LIST_FAIL,
  FRIEND_ADD_SUCCESS,
  FRIEND_ADD_FAIL
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
  const s1 = setDataReducer({
    successType: FRIEND_LIST_SUCCESS,
    failType: FRIEND_LIST_FAIL,
    initialState: state
  })(state, action);

  const s2 = setDataReducer({
    successType: FRIEND_ADD_SUCCESS,
    failType: FRIEND_ADD_FAIL,
    initialState: s1
  })(s1, action);

  return s1;
};
