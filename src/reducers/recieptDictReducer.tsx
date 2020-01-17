import {
  Dict,
  RecieptDictState,
  RecieptCacheAction,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: RecieptDictState = {
  error: false,
  data: {},
  errors: {}
};

const assignToData = (data: Dict, payload: any) => {
  Object.assign({}, data, {
    [payload.id]: payload
  });
};

export const recieptDictReducer = applyDataReducers<
  RecieptDictState,
  RecieptCacheAction
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
