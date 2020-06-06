import {
  FriendAction,
  FriendState,
  FRIEND_LIST_SUCCESS,
  FRIEND_LIST_FAIL,
  FRIEND_ADD_SUCCESS,
  FRIEND_ADD_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: FriendState = {
  error: false,
  data: {
    friends: []
  },
  errors: {}
};

export const friendReducer = applyDataReducers<FriendState, FriendAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: FRIEND_LIST_SUCCESS,
          failType: FRIEND_LIST_FAIL
        }
      ]
    },
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: FRIEND_ADD_SUCCESS,
          failType: FRIEND_ADD_FAIL,
          onSuccess: (acc: any, cur: any[]) => [cur].concat(acc)
        }
      ]
    }
  ]
);
