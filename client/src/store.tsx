import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, RootState } from './reducers/rootReducer';

import createSagaMiddleware from 'redux-saga'

import { loginSaga } from './sagas/loginSaga'

/*
const initialState = {
  login: false,
};
*/

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, sagaMiddleware),
  );

  sagaMiddleware.run(loginSaga)

  return store
}
