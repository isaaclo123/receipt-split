import { Dispatch } from "redux";
import { batch } from "react-redux";
import { fetchFriendsArchive, fetchFriends, fetchAddFriend, confirmFriend } from "../api/index";
import {
  FRIEND_ADD_SUCCESS,
  FRIEND_ADD_FAIL,
  FRIEND_LIST_SUCCESS,
  FRIEND_LIST_FAIL,
  FRIEND_LIST_SET_ACCEPTED_SUCCESS,
  FRIEND_LIST_SET_ACCEPTED_FAIL,
  FriendType,
  RootState
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { getUser, apiCallAction } from "./index";

export const getFriends = (archive = true): ApiMiddlewareAction =>
  apiCallAction({
    successType: FRIEND_LIST_SUCCESS,
    failType: FRIEND_LIST_FAIL,
    withToken: true,
    apiCall: archive ? fetchFriendsArchive : fetchFriends
  });

export const addFriend = (username: string): ApiMiddlewareAction =>
  apiCallAction({
    successType: FRIEND_ADD_SUCCESS,
    failType: FRIEND_ADD_FAIL,
    withToken: true,
    apiCall: fetchAddFriend,
    apiCallArgs: [username]
  });

export const getUserAndFriends = (archive = true) => (dispatch: Dispatch) => {
  batch(() => {
    dispatch(getUser());
    dispatch(getFriends(archive));
  });
};

export const setFriendConfirm = (
  id: number,
  action: "accept" | "reject",
  index: number,
): ApiMiddlewareAction =>
  apiCallAction({
    successType: FRIEND_LIST_SET_ACCEPTED_SUCCESS,
    failType: FRIEND_LIST_SET_ACCEPTED_FAIL,
    withToken: true,
    apiCall: confirmFriend,
    apiCallArgs: [id, action],
    onSuccess: (friend: FriendType, { friendState }: RootState ) => {
      const { id = -1 } = friend;
      const { data } = friendState;

      console.log("friend------")
      console.log(friend)
      console.log(friendState)
      console.log("friend------")

      if (id === -1) {
        return data;
      }

      return Object.assign({}, data, {
        friends_received: [
          ...data.friends_received.slice(0, index),
          friend,
          ...data.friends_received.slice(index + 1),
        ]
      });

    }
  });
