import { Dispatch } from "redux";

import { fetchReceiptById } from "../api/index";

import { RootState } from "../reducers/index";

import { ReceiptAction, ReceiptType } from "../types/index";

export const setReceipt = (payload: ReceiptType) => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const token = getState().loginState.token;

  const { id = -1 } = payload;

  console.log("setReceipt");
  console.log(payload);
  const action: ReceiptAction = {
    type: "RECIEPT_SET",
    payload: {
      receipt: payload
    }
  };

  dispatch(action);
};
