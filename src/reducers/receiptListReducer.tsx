import {
  ReceiptListState,
  ReceiptListAction,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_LIST_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: ReceiptListState = {
  error: false,
  data: [],
  errors: []
};

export const receiptListReducer = applyDataReducers<
  ReceiptListState,
  ReceiptListAction
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
