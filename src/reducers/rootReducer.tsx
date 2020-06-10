import { combineReducers } from "redux";

import {
  balanceSumListReducer,
  receiptReducer,
  receiptListReducer,
  receiptDictReducer,
  loginReducer,
  userReducer,
  friendReducer
} from "./index";

// export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  loginState: loginReducer,
  receiptListState: receiptListReducer,
  receiptDictState: receiptDictReducer,
  receiptState: receiptReducer,
  userState: userReducer,
  friendState: friendReducer,
  balanceSumListState: balanceSumListReducer
  // receiptState: receiptReducer
});
