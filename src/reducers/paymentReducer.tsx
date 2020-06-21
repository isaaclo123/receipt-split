import {
  PaymentAction,
  PaymentState,
  PAYMENT_SAVE_SUCCESS,
  PAYMENT_SAVE_FAIL,
  PAYMENT_SET_AMOUNT,
  PAYMENT_SET_NAME,
  PAYMENT_SET_MESSAGE,
  PAYMENT_SET_USER,
} from "../types/index";

import { editDataReducer, setDataReducer, applyDataReducers } from "./index";

const initialState: PaymentState = {
  error: false,
  data: {
    date: "",
    accepted: null,
    to_user: {
      id: -1,
      username: "",
      fullname: ""
    },
    from_user: {
      id: -1,
      username: "",
      fullname: ""
    },
    amount: 0.0,
    message: ""
  },
  errors: {}
};

export const paymentReducer = applyDataReducers<PaymentState, PaymentAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: PAYMENT_SAVE_SUCCESS,
          failType: PAYMENT_SAVE_FAIL
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: PAYMENT_SET_NAME,
          field: [["name", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: PAYMENT_SET_MESSAGE,
          field: [["message", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: PAYMENT_SET_USER,
          field: [["to_user", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: PAYMENT_SET_AMOUNT,
          field: [["amount", false]]
        }
      ]
    },
  ]
);
