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

export type BalanceSummaryType = {
  amount: number;
  receipt_name: string;
  receipt_id: number;
  id?: number;
}

export type BalanceType = BalanceSummaryType & {
  to_user: UserType;
  from_user: UserType;
  to_user_id?: number;
  from_user_id?: number;
  receipt?: ReceiptType;
};

// Balance Sum Type

export type BalanceSumType = {
  owed_amount: number,
  paid_amount: number,
  user: UserType,
  balances: BalanceSummaryType[]
};

export interface BalanceSumListType extends ErrorData {
  balances_owned: BalanceSumType[];
  balances_owed: BalanceSumType[];
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
