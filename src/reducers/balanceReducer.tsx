import {
  BalanceSumAction,
  BalanceSumListState,
  BALANCE_SUM_LIST_FAIL,
  BALANCE_SUM_LIST_SUCCESS
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: BalanceSumListState = {
  error: false,
  data: {
    balances_of: [],
    balances_owed: []
  },
  errors: {}
};

export const balanceSumListReducer = applyDataReducers<BalanceSumListState, BalanceSumAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: BALANCE_SUM_LIST_SUCCESS,
          failType: BALANCE_SUM_LIST_FAIL
        }
      ]
    }
  ]
);
