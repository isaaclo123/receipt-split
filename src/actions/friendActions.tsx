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

      if (id === -1) {
        return data;
      }

      const friends_received = [
        ...data.friends_received.slice(0, index),
        friend,
        ...data.friends_received.slice(index + 1),
      ];

      let friends = [...data.friends];

      if (action === "accept") {
        let add = true;
        for (let i = friends.length - 1; i >= 0; i--) {
            if(friends[i].id === friend.from_user.id) {
              console.log()
              console.log(friends[i].id)
              console.log(friend.from_user.id)
              console.log()
              add = false;
              break;
            }
        }

        // add friend
        if (add) {
          friends = [
            friend.from_user,
            ...data.friends
          ];
        }
      } else {
        // remove friend

        for (let i = friends.length - 1; i >= 0; i--) {
            if(friends[i].id === friend.from_user.id) {
              friends.splice(i, 1);
              break;
            }
        }
      }

      console.log(friends_received);
      console.log("friend------")

      return Object.assign({}, data, {
        friends_received,
        friends
      });

    }
  });
