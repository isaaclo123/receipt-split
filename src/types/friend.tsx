import { UserType, Dict, Action, Failable, ErrorData } from "./index";

import { FRIEND_LIST_SUCCESS, FRIEND_LIST_FAIL } from "../types/index";

export interface FriendListType extends ErrorData {
  friends: UserType[];
};

export type FriendListSuccessAction = Action<
  typeof FRIEND_LIST_SUCCESS,
  FriendListType
>;

export type FriendListFailAction = Action<typeof FRIEND_LIST_FAIL, Dict<any>>;

export type FriendAction = FriendListSuccessAction | FriendListFailAction;

export type FriendError = {
  [propName: string]: any;
};

export type FriendState = Failable<FriendListType, Dict>;
