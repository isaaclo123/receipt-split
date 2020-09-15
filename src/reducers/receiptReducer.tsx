import {
  ReceiptState,
  ReceiptIdAction,
  RECEIPT_ID_SUCCESS,
  RECEIPT_ID_FAIL,
  RECEIPT_SET_NAME,
  RECEIPT_SET_AMOUNT,
  RECEIPT_SET_DATE,
  RECEIPT_SET_TAX,
  RECEIPT_ADD_USER,
  RECEIPT_DELETE_USER,
  RECEIPT_ADD_RECEIPT_ITEM,
  RECEIPT_DELETE_RECEIPT_ITEM,
  RECEIPT_ITEM_SET_NAME,
  RECEIPT_ITEM_SET_AMOUNT,
  RECEIPT_ITEM_ADD_USER,
  RECEIPT_ITEM_DELETE_USER,
  RECEIPT_EDIT_RESET,
  UserType,
  RECEIPT_DELETE_FAIL,
} from "../types/index";

import { initState, setDataReducer, editDataReducer, applyDataReducers } from "./index";
import { getCurrentDate } from "./helpers";

const initialState = (
  user:UserType={
    id: -1,
    fullname: "",
    username: ""
  }): ReceiptState => initState({
  id: -1,
  name: "",
  amount: 0,
  tax: 0,
  date: getCurrentDate(),
  resolved: false,
  user: user,
  users: [],
  balances: [],
  receipt_items: []
});

export const receiptReducer = applyDataReducers<ReceiptState, ReceiptIdAction>(
  initialState(undefined),
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: RECEIPT_EDIT_RESET,
          // sets data to initial state
          onSuccess: (_: any, { data }: any) => {
            return initialState(data).data;
          },
        }
      ]
    },
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: RECEIPT_ID_SUCCESS,
          failType: RECEIPT_ID_FAIL,
          modified: false
        }
      ]
    },
    {
      reducerCreator: setDataReducer,
      args: [
        {
          // successType: RECEIPT_DELETE_SUCCESS,
          failType: RECEIPT_DELETE_FAIL
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
          successType: RECEIPT_SET_TAX,
          field: [["tax", false]]
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
