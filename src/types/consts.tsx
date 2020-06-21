import { Dict } from "./index"

export const PAYMENT_LIST_SET_ACCEPTED = "PAYMENT_LIST_SET_ACCEPTED";
export const PAYMENT_LIST_SET_ACCEPTED_SUCCESS = "PAYMENT_LIST_SET_ACCEPTED_SUCCESS";
export const PAYMENT_LIST_SET_ACCEPTED_FAIL = "PAYMENT_LIST_SET_ACCEPTED_FAIL";

export const PAYMENT_LIST_ADD_PAYMENT = "PAYMENT_LIST_ADD_PAYMENT";
export const PAYMENT_LIST_SUCCESS = "PAYMENT_LIST_SUCCESS";
export const PAYMENT_LIST_FAIL = "PAYMENT_LIST_FAIL";

export const PAYMENT_INDEX_DELETE_MAP: Dict<string> = {
  "payments_received": "PAYMENT_RECEIVED_INDEX_DELETE",
  "payments_sent": "PAYMENT_SENT_INDEX_DELETE",
}

export const PAYMENT_SAVE_SUCCESS = "PAYMENT_SAVE_SUCCESS";
export const PAYMENT_SAVE_FAIL = "PAYMENT_SAVE_FAIL";

export const PAYMENT_SET_NAME = "PAYMENT_SET_NAME"
export const PAYMENT_SET_AMOUNT = "PAYMENT_SET_AMOUNT"
export const PAYMENT_SET_MESSAGE = "PAYMENT_SET_MESSAGE"
export const PAYMENT_SET_USER = "PAYMENT_SET_USER"

export const BALANCE_SUM_LIST_SUCCESS = "BALANCE_SUM_LIST_SUCCESS";
export const BALANCE_SUM_LIST_FAIL = "BALANCE_SUM_LIST_FAIL";

export const TOKEN_LOCALSTORAGE = "TOKEN_LOCALSTORAGE";

export const RECEIPT_INDEX_DELETE_MAP: Dict<string> = {
  "receipts_owed": "RECEIPT_OF_INDEX_DELETE",
  "receipts_owned": "RECEIPT_OWNED_INDEX_DELETE",
};

export const RECEIPT_DELETE_SUCCESS = "RECEIPT_DELETE_SUCCESS";
export const RECEIPT_DELETE_FAIL = "RECEIPT_DELETE_FAIL";

export const RECEIPT_LIST_SUCCESS = "RECEIPT_LIST_SUCCESS";
export const RECEIPT_LIST_FAIL = "RECEIPT_LIST_FAIL";

// export const RECEIPT_ID_REQUEST = "RECEIPT_ID_REQUEST";
export const RECEIPT_ID_SUCCESS = "RECEIPT_ID_SUCCESS";
export const RECEIPT_ID_FAIL = "RECEIPT_ID_FAIL";

export const RECEIPT_CACHE_SUCCESS = "RECEIPT_CACHE_SUCCESS";
export const RECEIPT_CACHE_FAIL = "RECEIPT_CACHE_FAIL";

// export const RECEIPT_SAVE_REQUEST = "RECEIPT_SAVE_REQUEST";
export const RECEIPT_SAVE_SUCCESS = "RECEIPT_SAVE_REQUEST";
export const RECEIPT_SAVE_FAIL = "RECEIPT_SAVE_FAIL";

export const RECEIPT_SET = "RECEIPT_SET";

export const RECEIPT_SET_NAME = "RECEIPT_SET_NAME";
export const RECEIPT_SET_AMOUNT = "RECEIPT_SET_AMOUNT";
export const RECEIPT_SET_DATE = "RECEIPT_SET_DATE";
export const RECEIPT_ADD_USER = "RECEIPT_ADD_USER";
export const RECEIPT_DELETE_USER = "RECEIPT_DELETE_USER";

export const RECEIPT_ADD_RECEIPT_ITEM = "RECEIPT_ADD_RECEIPT_ITEM";
export const RECEIPT_DELETE_RECEIPT_ITEM = "RECEIPT_DELETE_RECEIPT_ITEM";

export const RECEIPT_ITEM_SET_NAME = "RECEIPT_ITEM_SET_NAME";
export const RECEIPT_ITEM_SET_AMOUNT = "RECEIPT_ITEM_SET_AMOUNT";
export const RECEIPT_ITEM_ADD_USER = "RECEIPT_ITEM_ADD_USER";
export const RECEIPT_ITEM_DELETE_USER = "RECEIPT_ITEM_DELETE_USER";

// export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";

// export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAIL = "SIGNUP_FAIL";

// export const USER_INFO_REQUEST = "USER_INFO_REQUEST";
export const USER_INFO_SUCCESS = "USER_INFO_SUCCESS";
export const USER_INFO_FAIL = "USER_INFO_FAIL";

// export const FRIEND_INDEX_DELETE_MAP: Dict<string> = {
//   "payments_received": "PAYMENT_RECEIVED_INDEX_DELETE",
//   "payments_sent": "PAYMENT_SENT_INDEX_DELETE",
// }

export const FRIEND_LIST_SUCCESS = "FRIEND_LIST_SUCCESS";
export const FRIEND_LIST_FAIL = "FRIEND_LIST_FAIL";

export const FRIEND_ADD_SUCCESS = "FRIEND_ADD_SUCCESS";
export const FRIEND_ADD_FAIL = "FRIEND_ADD_FAIL";

export const FRIEND_LIST_SET_ACCEPTED = "PAYMENT_LIST_SET_ACCEPTED";
export const FRIEND_LIST_SET_ACCEPTED_SUCCESS = "PAYMENT_LIST_SET_ACCEPTED_SUCCESS";
export const FRIEND_LIST_SET_ACCEPTED_FAIL = "PAYMENT_LIST_SET_ACCEPTED_FAIL";

export const API_MIDDLEWARE_TYPE = "API_MIDDLEWARE_TYPE";

export const EDIT_DATA_PREPEND = -1;
export const EDIT_DATA_APPEND = -2;
