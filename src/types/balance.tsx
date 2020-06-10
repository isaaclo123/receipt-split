import {
  UserType,
  ReceiptType,
  Dict,
  Action,
  Failable,
  ErrorData,
  BALANCE_SUM_LIST_SUCCESS,
  BALANCE_SUM_LIST_FAIL,
} from "./index";

export type BalanceType = {
  id?: number;
  to_user: UserType;
  from_user: UserType;
  to_user_id?: number;
  from_user_id?: number;
  amount: number;
  receipt?: ReceiptType;
};

// Balance Sum Type

export type BalanceSumType = {
  total: number,
  user: UserType,
  receipts: ReceiptType[]
};

export interface BalanceSumListType extends ErrorData {
  balance_sums: BalanceSumType[];
};

export type BalanceSumListSuccessAction = Action<
  typeof BALANCE_SUM_LIST_SUCCESS,
  BalanceSumListType
>;

export type BalanceSumListFailAction = Action<typeof BALANCE_SUM_LIST_FAIL, Dict<any>>;

export type BalanceSumAction = BalanceSumListSuccessAction | BalanceSumListFailAction;

export type BalanceSumListError = {
  [propName: string]: any;
};

export type BalanceSumListState = Failable<BalanceSumListType, Dict>;
