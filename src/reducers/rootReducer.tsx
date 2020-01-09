import { combineReducers } from "redux";

import { recieptListReducer, loginReducer, userReducer } from "./index";

// export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  loginState: loginReducer,
  recieptListState: recieptListReducer,
  userState: userReducer
  // recieptState: recieptReducer
});
