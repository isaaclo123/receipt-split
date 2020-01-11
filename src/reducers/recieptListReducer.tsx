import {
  RecieptListState,
  RecieptListAction,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_LIST_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: RecieptListState = {
  error: false,
  data: [],
  errors: []
};

export const recieptListReducer = applyDataReducers<
  RecieptListState,
  RecieptListAction
>(initialState, [
  {
    reducerCreator: setDataReducer,
    args: [
      {
        successType: RECIEPT_LIST_SUCCESS,
        failType: RECIEPT_LIST_FAIL
      }
    ]
  }
]);
