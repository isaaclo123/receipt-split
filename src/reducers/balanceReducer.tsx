import {
  BalanceSumAction,
  BalanceSumListState,
  BALANCE_SUM_LIST_FAIL,
  BALANCE_SUM_LIST_SUCCESS
} from "../types/index";

import { initState, setDataReducer, applyDataReducers } from "./index";

const initialState: BalanceSumListState = initState({
  balances_owned: [],
  balances_owed: []
});

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
