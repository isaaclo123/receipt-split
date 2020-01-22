import {
  RecieptState,
  RecieptIdAction,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL,
  RECIEPT_SET_NAME,
  RECIEPT_SET_AMOUNT,
  RECIEPT_SET_DATE
} from "../types/index";

import { setDataReducer, editDataReducer, applyDataReducers } from "./index";

const initialState: RecieptState = {
  error: false,
  data: {
    id: -1,
    name: "",
    amount: 0,
    date: "",
    resolved: false,
    user: {
      id: -1,
      fullname: "",
      username: ""
    },
    users: [],
    balances: [],
    reciept_items: []
  },
  errors: {}
};

export const recieptReducer = applyDataReducers<RecieptState, RecieptIdAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: RECIEPT_ID_SUCCESS,
          failType: RECIEPT_ID_FAIL
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECIEPT_SET_NAME,
          field: [["name", null]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECIEPT_SET_AMOUNT,
          field: [["amount", null]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECIEPT_SET_DATE,
          field: [["date", null]]
        }
      ]
    }
  ]
);
