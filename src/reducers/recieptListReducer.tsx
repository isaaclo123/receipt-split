import {
  RecieptListState,
  RecieptListAction,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_LIST_FAIL
} from "../types/index";

import { setDataReducer } from "./index";

const initialState: RecieptListState = {
  error: false,
  data: [],
  errors: []
};

export const recieptListReducer = (
  state: RecieptListState = initialState,
  action: RecieptListAction
) => {
  return setDataReducer({
    successType: RECIEPT_LIST_SUCCESS,
    failType: RECIEPT_LIST_FAIL,
    initialState: state
  })(state, action);
};
