import { combineReducers } from "redux";

import { loginReducer, recieptListReducer } from "./index";

export const rootReducer = combineReducers({
  loginState: loginReducer,
  recieptListState: recieptListReducer
  // userState: userReducer,
  // recieptState: recieptReducer
});
