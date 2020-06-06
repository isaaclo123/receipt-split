import {
  ReceiptData,
  ReceiptAction,
  ReceiptType,
  ReceiptListState,
  ReceiptListAction
} from "../types/index";

const initialState: ReceiptListState = {
  error: false,
  data: [],
  errors: []
};

export const receiptReducer = (
  state: ReceiptListState = initialState,
  { payload, type }: ReceiptListAction
) => {
  if (payload == null) {
    return state;
  }

  console.log("RECIPET_LIST_PAYLOAD");
  console.log(payload);
  console.log("RECIPET_LIST_PAYLOAD");

  switch (type) {
    case "RECEIPT_LIST_SUCCESS":
      return {
        error: false,
        data: payload,
        errors: []
      };
    case "RECEIPT_LIST_FAIL":
      return Object.assign({}, state, {
        error: true,
        errors: [] //TODO
      });
    default:
      return state;
  }
};
