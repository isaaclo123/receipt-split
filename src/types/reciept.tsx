import { UserType, BalanceType } from "./index";

export interface RecieptData {
  id: number;
}

export interface RecieptRequestAction {
  type: string;
  payload: RecieptData;
}

export interface RecieptSetAction {
  type: string;
  payload: RecieptType;
}

export interface RecieptAction {
  type: string;
  payload: RecieptState;
}

// reciept state

export interface RecieptState {
  reciept: RecieptType | null;
}

// reciept list
export interface RecieptListAction {
  type: string;
  payload: RecieptListState;
}

export interface RecieptListState {
  reciepts: RecieptType[];
}

// server types

export type RecieptType = {
  id?: number;
  name: string;
  amount: number;
  date: string;
  resolved?: boolean | null;
  user_id?: number;
  user?: UserType; //TODO
  users?: UserType[]; //TODO
  balances?: BalanceType[];
  reciept_items?: RecieptItemType[];
};

export type RecieptItemType = {
  id?: number;
  name: string;
  amount: number;
  users?: UserType[]; //TODO
  reciept_id?: number;
  reciept?: RecieptType;
};

const userListExample: UserType[] = [];

export const RecieptItemTypeDefault: RecieptItemType = {
  name: "New Reciept Item",
  amount: 0,
  users: userListExample
};
