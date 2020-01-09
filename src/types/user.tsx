import { Failable, RecieptType } from "./index";

import { USER_INFO_SUCCESS, USER_INFO_FAIL, RootState } from "../types/index";

export type UserType = {
  id: number;
  // friend_of_id?: number;
  // friends?: UserType[];

  username: string;
  fullname: string;

  // reciepts?: RecieptType;
  // reciept_items?: number;
};

export type UserErrors = {
  id?: string;
  // friend_of_id?: number;
  // friends?: UserType[];

  username?: string;
  fullname?: string;

  // reciepts?: RecieptType;
  // reciept_items?: number;
};

export interface UserInfoSuccessAction {
  type: typeof USER_INFO_SUCCESS;
  payload: UserType;
}

export interface UserInfoFailAction {
  type: typeof USER_INFO_FAIL;
  payload: UserErrors;
}

export type UserAction = UserInfoSuccessAction | UserInfoFailAction;

// export interface UserAction {
//   type: string;
//   payload: UserState;
// }

export type UserState = Failable<UserType, {}>;
