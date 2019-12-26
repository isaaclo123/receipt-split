import { RecieptType } from "./index";

export type UserType = {
  id?: number;
  friend_of_id?: number;
  friends?: UserType[];

  username: string;
  fullname?: string;

  reciepts?: RecieptType;
  reciept_items?: number;
};

export interface UserRequestAction {
  type: string;
}

export interface UserAction {
  type: string;
  payload: UserState | null;
}

export interface UserState {
  user: UserType | null;
}
