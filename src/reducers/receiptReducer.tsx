import {
  ReceiptState,
  ReceiptIdAction,
  RECEIPT_ID_SUCCESS,
  RECEIPT_ID_FAIL,
  RECEIPT_SET_NAME,
  RECEIPT_SET_AMOUNT,
  RECEIPT_SET_DATE,
  RECEIPT_ADD_USER,
  RECEIPT_DELETE_USER,
  RECEIPT_ADD_RECEIPT_ITEM,
  RECEIPT_DELETE_RECEIPT_ITEM,
  RECEIPT_ITEM_SET_NAME,
  RECEIPT_ITEM_SET_AMOUNT,
  RECEIPT_ITEM_ADD_USER,
  RECEIPT_ITEM_DELETE_USER
} from "../types/index";

import { setDataReducer, editDataReducer, applyDataReducers } from "./index";

const initialState: ReceiptState = {
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
    receipt_items: []
  },
  errors: {}
};

export const receiptReducer = applyDataReducers<ReceiptState, ReceiptIdAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: RECEIPT_ID_SUCCESS,
          failType: RECEIPT_ID_FAIL
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_SET_NAME,
          field: [["name", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_SET_AMOUNT,
          field: [["amount", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_SET_DATE,
          field: [["date", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_ADD_USER,
          field: [["users", true]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_DELETE_USER,
          field: [["users", true]],
          isDelete: true
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_ADD_RECEIPT_ITEM,
          field: [["receipt_items", true]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_DELETE_RECEIPT_ITEM,
          field: [["receipt_items", true]],
          isDelete: true
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_ITEM_SET_NAME,
          field: [["receipt_items", true], ["name", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_ITEM_SET_AMOUNT,
          field: [["receipt_items", true], ["amount", false]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_ITEM_ADD_USER,
          field: [["receipt_items", true], ["users", true]]
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECEIPT_ITEM_DELETE_USER,
          field: [["receipt_items", true], ["users", true]],
          isDelete: true
        }
      ]
    }
  ]
);
