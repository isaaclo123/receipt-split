import {
  Dict,
  ReceiptDictState,
  ReceiptCacheAction,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: ReceiptDictState = {
  error: false,
  data: {},
  errors: {}
};

const assignToData = (data: Dict, payload: any) => {
  Object.assign({}, data, {
    [payload.id]: payload
  });
};

export const receiptDictReducer = applyDataReducers<
  ReceiptDictState,
  ReceiptCacheAction
>(initialState, [
  {
    reducerCreator: setDataReducer,
    args: [
      {
        successType: RECIEPT_ID_SUCCESS,
        failType: RECIEPT_ID_FAIL,
        onSuccess: assignToData,
        onFail: assignToData
      }
    ]
  }
]);
