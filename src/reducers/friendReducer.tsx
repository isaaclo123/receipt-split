import {
  FriendAction,
  FriendState,
  FRIEND_LIST_SUCCESS,
  FRIEND_LIST_FAIL,
  FRIEND_ADD_SUCCESS,
  FRIEND_ADD_FAIL,
  FRIEND_LIST_SET_ACCEPTED_SUCCESS,
  FRIEND_LIST_SET_ACCEPTED_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: FriendState = {
  error: false,
  data: {
    friends: [],
    friends_received: [],
    friends_sent: []
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
          successType: FRIEND_LIST_SET_ACCEPTED_SUCCESS,
          failType: FRIEND_LIST_SET_ACCEPTED_FAIL
        }
      ]
    },
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
          onSuccess: (data: any, payload: any[]) => {
            // return {
            //   "friends": [payload].concat(data.friends)
            // }
            return Object.assign({}, data, {
              "friends_sent": [payload].concat(data.friends_sent)
            });
          }
        }
      ]
    }
  ]
);
