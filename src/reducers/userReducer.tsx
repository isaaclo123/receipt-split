import {
  UserAction,
  UserState,
  USER_INFO_SUCCESS,
  USER_INFO_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: UserState = {
  error: false,
  data: {
    id: -1,
    username: "",
    fullname: ""
  },
  errors: {}
};

export const userReducer = applyDataReducers<UserState, UserAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: USER_INFO_SUCCESS,
          failType: USER_INFO_FAIL
        }
      ]
    }
  ]
);
