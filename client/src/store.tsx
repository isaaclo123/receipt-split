import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, RootState } from './reducers/rootReducer';

/*
const initialState = {
  login: false,
};
*/

export default function configureStore() {
  return createStore(
    rootReducer,
    applyMiddleware(thunk)
  );
}