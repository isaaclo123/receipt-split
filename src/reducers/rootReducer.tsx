import { combineReducers } from "redux";

import {
  balanceSumListReducer,
  paymentListReducer,
  paymentReducer,
  receiptReducer,
  receiptListReducer,
  receiptDictReducer,
  loginReducer,
  userReducer,
  friendReducer
} from "./index";

export const rootReducer = combineReducers({
  loginState: loginReducer,
  receiptListState: receiptListReducer,
  receiptDictState: receiptDictReducer,
  receiptState: receiptReducer,
  userState: userReducer,
  friendState: friendReducer,
  balanceSumListState: balanceSumListReducer,
  paymentState: paymentReducer,
  paymentListState: paymentListReducer
});
