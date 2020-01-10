import {
  RecieptListState,
  RecieptListAction,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_LIST_FAIL
} from "../types/index";

import { getDataReducer } from "./index";

const initialState: RecieptListState = {
  error: false,
  data: [],
  errors: []
};

export const recieptListReducer = (
  state: RecieptListState = initialState,
  action: RecieptListAction
) => {
  return getDataReducer(RECIEPT_LIST_SUCCESS, RECIEPT_LIST_FAIL, state)(
    state,
    action
  );
};
