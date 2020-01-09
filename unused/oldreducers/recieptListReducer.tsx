import {
  RecieptData,
  RecieptAction,
  RecieptType,
  RecieptListState,
  RecieptListAction
} from "../types/index";

const initialState: RecieptListState = {
  error: false,
  data: [],
  errors: []
};

export const recieptReducer = (
  state: RecieptListState = initialState,
  { payload, type }: RecieptListAction
) => {
  if (payload == null) {
    return state;
  }

  console.log("RECIPET_LIST_PAYLOAD");
  console.log(payload);
  console.log("RECIPET_LIST_PAYLOAD");

  switch (type) {
    case "RECIEPT_LIST_SUCCESS":
      return {
        error: false,
        data: payload,
        errors: []
      };
    case "RECIEPT_LIST_FAIL":
      return Object.assign({}, state, {
        error: true,
        errors: [] //TODO
      });
    default:
      return state;
  }
};
