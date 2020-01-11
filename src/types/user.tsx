import { Action, Failable } from "./index";

import {
  USER_INFO_SUCCESS,
  USER_INFO_FAIL,
  FRIEND_LIST_SUCCESS,
  FRIEND_LIST_FAIL
} from "../types/index";

export type UserType = {
  id: number;
  username: string;
  fullname: string;
};

export type UserErrors = {
  id?: string;
  username?: string;
  fullname?: string;
};

export type UserInfoSuccessAction = Action<typeof USER_INFO_SUCCESS, UserType>;
export type UserInfoFailAction = Action<typeof USER_INFO_FAIL, UserErrors>;

export type UserAction = UserInfoSuccessAction | UserInfoFailAction;

export type UserState = Failable<UserType, UserErrors>;

// friends

export type FriendListSuccessAction = Action<
  typeof FRIEND_LIST_SUCCESS,
  UserType[]
>;
export type FriendListFailAction = Action<
  typeof FRIEND_LIST_FAIL,
  UserErrors[]
>;

export type FriendAction = FriendListSuccessAction | FriendListFailAction;

export type FriendError = {
  [propName: string]: any;
};

export type FriendState = Failable<UserType[], FriendError>;
