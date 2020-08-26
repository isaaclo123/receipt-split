import {
  ReceiptListState,
  ReceiptListAction,
  RECEIPT_LIST_SUCCESS,
  RECEIPT_LIST_FAIL,
  RECEIPT_INDEX_DELETE_MAP,
} from "../types/index";

import {
  createDeleteReducers,
  setDataReducer,
  applyDataReducers,
  initState
} from "./index";

const initialState: ReceiptListState = initState({
  receipts_owned: [],
  receipts_owed: [],
  receipts_owned_resolved: [],
  receipts_owed_resolved: [],
});

const deleteReducers = createDeleteReducers(RECEIPT_INDEX_DELETE_MAP);

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
        failType: RECEIPT_LIST_FAIL,
      }
    ]
  },
]));
