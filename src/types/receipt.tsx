import {
  Action,
  ErrorData,
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
  // RECIEPT_SET_DATE
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
  typeof RECIEPT_LIST_SUCCESS,
  ReceiptListType
>;

export type ReceiptListFailAction = Action<typeof RECIEPT_LIST_FAIL, []>;

export type ReceiptListAction =
  | ReceiptListSuccessAction
  | ReceiptListFailAction;

export type ReceiptListState = Failable<ReceiptListType, string[]>; //TODO error type?

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
  typeof RECIEPT_CACHE_SUCCESS,
  ReceiptType
>;
export type ReceiptCacheFailAction = Action<
  typeof RECIEPT_CACHE_FAIL,
  Dict<any>
>;

export type ReceiptCacheAction =
  | ReceiptCacheSuccessAction
  | ReceiptCacheFailAction;

export type ReceiptIdSuccessAction = Action<
  typeof RECIEPT_ID_SUCCESS,
  ReceiptType
>;

export type ReceiptIdFailAction = Action<typeof RECIEPT_ID_FAIL, Dict<any>>;

export type ReceiptIdAction = ReceiptIdSuccessAction | ReceiptIdFailAction;
//
// export type ReceiptSetNameAction = Action<typeof RECIEPT_SET_NAME, string>;
// export type ReceiptSetAmountAction = Action<typeof RECIEPT_SET_AMOUNT, string>;

//
// const userListExample: UserType[] = [];
//
// export const ReceiptItemTypeDefault: ReceiptItemType = {
//   name: "New Receipt Item",
//   amount: 0,
//   users: userListExample
// };
