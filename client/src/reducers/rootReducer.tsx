import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import recieptReducer from './recieptReducer';

export const rootReducer = combineReducers({
  loginState: loginReducer,
  recieptState: recieptReducer
});

export type RootState = ReturnType<typeof rootReducer>
