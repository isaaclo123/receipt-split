import {
  Dict,
  DataReducerType,
  ReceiptListState,
  ReceiptListAction,
  RECEIPT_LIST_SUCCESS,
  RECEIPT_LIST_FAIL,
  RECEIPT_INDEX_DELETE_MAP,
//  RECEIPT_DELETE_SUCCESS,
//  RECEIPT_DELETE_FAIL
} from "../types/index";

import { editDataReducer, setDataReducer, applyDataReducers } from "./index";

const initialState: ReceiptListState = {
  error: false,
  data: {
    receipts_owned: [],
    receipts_of: [],
  },
  errors: []
};

const createDeleteReducers = (map: Dict<string>): DataReducerType[] =>
  Object.entries(map).map(([field, type]: [string, string]) => {
    return {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: type,
          field: [[field, true]],
          isDelete: true
        }
      ]
    }
  })

const deleteReducers = createDeleteReducers(RECEIPT_INDEX_DELETE_MAP)
console.log(deleteReducers)

export const receiptListReducer = applyDataReducers<
  ReceiptListState,
  ReceiptListAction
>(initialState,
  deleteReducers.concat([
  {
    reducerCreator: setDataReducer,
    args: [
      {
        successType: RECEIPT_LIST_SUCCESS,
        failType: RECEIPT_LIST_FAIL
      }
    ]
  },
]));
