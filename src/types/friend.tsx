import { UserType, Dict, Action, Failable } from "./index";

import { FRIEND_LIST_SUCCESS, FRIEND_LIST_FAIL } from "../types/index";

export type FriendListSuccessAction = Action<
  typeof FRIEND_LIST_SUCCESS,
  UserType[]
>;
export type FriendListFailAction = Action<typeof FRIEND_LIST_FAIL, Dict<any>>;

export type FriendAction = FriendListSuccessAction | FriendListFailAction;

export type FriendError = {
  [propName: string]: any;
};

export type FriendState = Failable<UserType[], Dict>;
