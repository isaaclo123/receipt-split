import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import recieptReducer from './recieptReducer';
import recieptListReducer from './recieptListReducer';
import userReducer from './userReducer';

export const rootReducer = combineReducers({
  loginState: loginReducer,
  recieptListState: recieptListReducer,
  userState: userReducer,
  recieptState: recieptReducer,
});

export type RootState = ReturnType<typeof rootReducer>
