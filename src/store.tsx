import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, RootState } from './reducers/rootReducer';

import createSagaMiddleware from 'redux-saga'

import { loginSaga } from './sagas/loginSaga'
import { signupSaga } from './sagas/signupSaga'
import { recieptListSaga } from './sagas/recieptListSaga'
import { recieptSaga } from './sagas/recieptSaga'
import { userSaga } from './sagas/userSaga'
import { saveRecieptSaga } from './sagas/saveRecieptSaga'

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, sagaMiddleware),
  );

  sagaMiddleware.run(loginSaga)
  sagaMiddleware.run(signupSaga)
  sagaMiddleware.run(recieptListSaga)
  sagaMiddleware.run(recieptSaga)
  sagaMiddleware.run(userSaga)
  sagaMiddleware.run(saveRecieptSaga)

  return store
}
