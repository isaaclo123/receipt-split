import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import { apiCallMiddleware } from "./actions/index";
import { rootReducer } from "./reducers/index";

const store = createStore(
  rootReducer,
  // applyMiddleware(thunk, apiCallMiddleware)
  applyMiddleware(thunk)
);

export default store;
