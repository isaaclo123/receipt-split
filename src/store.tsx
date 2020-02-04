import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { apiCallMiddleware } from "./actions/index";
import { rootReducer } from "./reducers/index";

// import { receiptListSaga } from "./sagas/receiptListSaga";
// import { receiptSaga } from "./sagas/receiptSaga";
// import { userSaga } from "./sagas/userSaga";
// import { saveReceiptSaga } from "./sagas/saveReceiptSaga";

export default function configureStore() {
  // const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, apiCallMiddleware)
  );

  // sagaMiddleware.run(loginSaga)
  // sagaMiddleware.run(signupSaga);
  // sagaMiddleware.run(receiptListSaga);
  // sagaMiddleware.run(receiptSaga);
  // sagaMiddleware.run(userSaga);
  // sagaMiddleware.run(saveReceiptSaga);

  return store;
}
