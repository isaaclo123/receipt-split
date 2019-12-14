import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import recieptReducer from './recieptReducer';
import recieptListReducer from './recieptListReducer';

export const rootReducer = combineReducers({
  loginState: loginReducer,
  recieptState: recieptReducer,
  recieptListState: recieptListReducer
});

export type RootState = ReturnType<typeof rootReducer>
