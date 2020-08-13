import {
  UserAction,
  UserState,
  USER_INFO_SUCCESS,
  USER_INFO_FAIL
} from "../types/index";

import { initState, setDataReducer, applyDataReducers } from "./index";

const initialState: UserState = initState({
  id: -1,
  username: "",
  fullname: ""
});

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
