import { combineReducers } from "redux";

import {
  recieptReducer,
  recieptListReducer,
  recieptDictReducer,
  loginReducer,
  userReducer,
  friendReducer
} from "./index";

// export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  loginState: loginReducer,
  recieptListState: recieptListReducer,
  recieptDictState: recieptDictReducer,
  recieptState: recieptReducer,
  userState: userReducer,
  friendState: friendReducer
  // recieptState: recieptReducer
});
