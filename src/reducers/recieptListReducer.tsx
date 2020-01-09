import {
  RecieptListState,
  RecieptListAction,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_LIST_FAIL
} from "../types/index";

const initialState: RecieptListState = {
  error: false,
  data: [],
  errors: []
};

export const recieptListReducer = (
  state: RecieptListState = initialState,
  action: RecieptListAction
) => {
  switch (action.type) {
    case RECIEPT_LIST_SUCCESS:
      return {
        error: false,
        data: action.payload,
        errors: []
      };
    case RECIEPT_LIST_FAIL:
      return Object.assign({}, state, {
        error: true,
        errors: action.payload //TODO
      });
    default:
      return state;
  }
};
