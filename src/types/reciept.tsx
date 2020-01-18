import {
  Action,
  Failable,
  Dict,
  UserType,
  BalanceType,
  // RECIEPT_SAVE_REQUEST,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL,
  RECIEPT_CACHE_SUCCESS,
  RECIEPT_CACHE_FAIL,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_LIST_FAIL,
  RECIEPT_SET_NAME,
  RECIEPT_SET_AMOUNT,
  RECIEPT_SET_DATE
} from "./index";

export interface RecieptPayload {
  id: number;
}

// export interface RecieptRequestAction {
//   type: string;
//   payload: RecieptPayload;
// }

// export type RecieptSetAction = Action<typeof RECIEPT_SAVE_REQUEST, RecieptType>;

export interface RecieptAction {
  type: string;
  payload: RecieptState;
}

// reciept state

export type RecieptState = Failable<RecieptType, RecieptError>;

// reciept list

export type RecieptListSuccessAction = Action<
  typeof RECIEPT_LIST_SUCCESS,
  RecieptType[]
>;

export type RecieptListFailAction = Action<typeof RECIEPT_LIST_FAIL, []>;

export type RecieptListAction =
  | RecieptListSuccessAction
  | RecieptListFailAction;

export type RecieptListState = Failable<RecieptType[], string[]>;

// server types

export type RecieptError = {
  id?: string;
  name?: string;
  amount?: string;
  date?: string;
  resolved?: string;
  user_id?: string;
  user?: string;
  users?: string;
  balances?: string;
  reciept_items?: string;
};

export type RecieptSummaryType = {
  id?: number;
  name: string;
  amount: number;
  date: string;
  resolved: boolean;
  user: UserType;
};

export type RecieptType = RecieptSummaryType & {
  user_id?: number;
  users: UserType[];
  balances: BalanceType[];
  reciept_items: RecieptItemType[];
};

export type RecieptItemType = {
  id?: number;
  name: string;
  amount: number;
  users?: UserType[]; //TODO
  reciept_id?: number;
  reciept?: RecieptType;
};

export type RecieptDictState = Failable<Dict<RecieptType>, Dict<any>>;

export type RecieptCacheSuccessAction = Action<
  typeof RECIEPT_CACHE_SUCCESS,
  RecieptType
>;
export type RecieptCacheFailAction = Action<
  typeof RECIEPT_CACHE_FAIL,
  Dict<any>
>;

export type RecieptCacheAction =
  | RecieptCacheSuccessAction
  | RecieptCacheFailAction;

export type RecieptIdSuccessAction = Action<
  typeof RECIEPT_ID_SUCCESS,
  RecieptType
>;
export type RecieptIdFailAction = Action<typeof RECIEPT_ID_FAIL, Dict<any>>;

export type RecieptIdAction = RecieptIdSuccessAction | RecieptIdFailAction;

export type RecieptSetNameAction = Action<typeof RECIEPT_SET_NAME, string>;
export type RecieptSetAmountAction = Action<typeof RECIEPT_SET_AMOUNT, string>;

//
// const userListExample: UserType[] = [];
//
// export const RecieptItemTypeDefault: RecieptItemType = {
//   name: "New Reciept Item",
//   amount: 0,
//   users: userListExample
// };
