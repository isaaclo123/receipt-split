import {
  Action,
  ErrorData,
  Failable,
  Dict,
  UserType,
  BalanceType,
  // RECEIPT_SAVE_REQUEST,
  RECEIPT_ID_SUCCESS,
  RECEIPT_ID_FAIL,
  RECEIPT_CACHE_SUCCESS,
  RECEIPT_CACHE_FAIL,
  RECEIPT_LIST_SUCCESS,
  RECEIPT_LIST_FAIL,
  RECEIPT_SET_NAME,
  RECEIPT_SET_AMOUNT,
  // RECEIPT_SET_DATE
} from "./index";

export interface ReceiptPayload {
  id: number;
}

export interface ReceiptAction {
  type: string;
  payload: ReceiptState;
}

// receipt state

export type ReceiptState = Failable<ReceiptType, ReceiptError>;

// receipt list

export interface ReceiptListType extends ErrorData {
  receipts_owned: ReceiptType[];
  receipts_of: ReceiptType[];
};

export type ReceiptListSuccessAction = Action<
  typeof RECEIPT_LIST_SUCCESS,
  ReceiptListType
>;

export type ReceiptListFailAction = Action<typeof RECEIPT_LIST_FAIL, []>;

export type ReceiptListAction =
  | ReceiptListSuccessAction
  | ReceiptListFailAction;

export interface ReceiptListError extends ErrorData {}

export type ReceiptListState = Failable<ReceiptListType, ReceiptListError>; //TODO error type?

// server types

export interface ReceiptError extends ErrorData {
  id?: string;
  name?: string;
  amount?: string;
  date?: string;
  resolved?: string;
  user_id?: string;
  user?: string;
  users?: string;
  balances?: string;
  receipt_items?: string;
};

export type ReceiptSummaryType = {
  id?: number;
  name: string;
  amount: number;
  date: string;
  resolved: boolean;
  user: UserType;
};

export type ReceiptType = ReceiptSummaryType & {
  user_id?: number;
  users: UserType[];
  balances: BalanceType[];
  receipt_items: ReceiptItemType[];
};

export type ReceiptItemType = {
  id?: number;
  name: string;
  amount: number;
  users: UserType[]; //TODO
  // receipt_id?: number;
  // receipt?: ReceiptType;
};

export type ReceiptDictState = Failable<Dict<ReceiptType>, Dict<any>>;

export type ReceiptCacheSuccessAction = Action<
  typeof RECEIPT_CACHE_SUCCESS,
  ReceiptType
>;
export type ReceiptCacheFailAction = Action<
  typeof RECEIPT_CACHE_FAIL,
  Dict<any>
>;

export type ReceiptCacheAction =
  | ReceiptCacheSuccessAction
  | ReceiptCacheFailAction;

export type ReceiptIdSuccessAction = Action<
  typeof RECEIPT_ID_SUCCESS,
  ReceiptType
>;

export type ReceiptIdFailAction = Action<typeof RECEIPT_ID_FAIL, Dict<any>>;

export type ReceiptIdAction = ReceiptIdSuccessAction | ReceiptIdFailAction;
//
// export type ReceiptSetNameAction = Action<typeof RECEIPT_SET_NAME, string>;
// export type ReceiptSetAmountAction = Action<typeof RECEIPT_SET_AMOUNT, string>;

//
// const userListExample: UserType[] = [];
//
// export const ReceiptItemTypeDefault: ReceiptItemType = {
//   name: "New Receipt Item",
//   amount: 0,
//   users: userListExample
// };
