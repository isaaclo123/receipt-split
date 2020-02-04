import { combineReducers } from "redux";

import { loginReducer, receiptListReducer } from "./index";

export const rootReducer = combineReducers({
  loginState: loginReducer,
  receiptListState: receiptListReducer
  // userState: userReducer,
  // receiptState: receiptReducer
});
