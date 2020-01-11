import { Action, Failable } from "./index";

import {
  USER_INFO_SUCCESS,
  USER_INFO_FAIL,
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
