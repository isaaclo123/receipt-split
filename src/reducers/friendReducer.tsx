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

// TODO: likely dont need initialState
export const friendReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  const s1 = setDataReducer({
    successType: FRIEND_LIST_SUCCESS,
    failType: FRIEND_LIST_FAIL,
    initialState
  })(state, action);

  console.log(s1);

  const s2 = setDataReducer({
    successType: FRIEND_ADD_SUCCESS,
    failType: FRIEND_ADD_FAIL,
    initialState
  })(s1, action);

  console.log(s1);

  return s2;
};
