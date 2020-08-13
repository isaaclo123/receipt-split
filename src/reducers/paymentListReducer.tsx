import {
  PaymentListAction,
  PaymentListState,
  PAYMENT_INDEX_DELETE_MAP,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
  PAYMENT_LIST_ADD_PAYMENT,
  PAYMENT_LIST_SET_ACCEPTED_SUCCESS,
  PAYMENT_LIST_SET_ACCEPTED_FAIL
} from "../types/index";

import {
  createDeleteReducers,
  applyDataReducers,
  editDataReducer,
  setDataReducer,
  initState
} from "./index";

const initialState: PaymentListState = initState({
  payments_received: [],
  payments_sent: [],
});

const deleteReducers = createDeleteReducers(PAYMENT_INDEX_DELETE_MAP);

export const paymentListReducer = applyDataReducers<
  PaymentListState,
  PaymentListAction
>(initialState,
  deleteReducers.concat([
  {
    reducerCreator: setDataReducer,
    args: [
      {
        successType: PAYMENT_LIST_SET_ACCEPTED_SUCCESS,
        failType: PAYMENT_LIST_SET_ACCEPTED_FAIL,
      }
    ]
  },
  {
    reducerCreator: setDataReducer,
    args: [
      {
        successType: PAYMENT_LIST_SUCCESS,
        failType: PAYMENT_LIST_FAIL
      }
    ]
  },
  {
    reducerCreator: editDataReducer,
    args: [
      {
        successType: PAYMENT_LIST_ADD_PAYMENT,
        field: [["payments_sent", true]]
      }
    ]
  },
]));
