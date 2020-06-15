import {
  PaymentListAction,
  PaymentListState,
  PAYMENT_INDEX_DELETE_MAP,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
} from "../types/index";

import {
  createDeleteReducers,
  setDataReducer,
  applyDataReducers
} from "./index";

const initialState: PaymentListState = {
  error: false,
  data: {
    payments_received: [],
    payments_sent: [],
  },
  errors: {}
};

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
        successType: PAYMENT_LIST_SUCCESS,
        failType: PAYMENT_LIST_FAIL
      }
    ]
  },
]));
