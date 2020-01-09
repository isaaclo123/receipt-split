import { Dispatch } from "redux";

import { fetchRecieptById } from "../api/index";

import { RootState } from "../reducers/index";

import { RecieptAction, RecieptType } from "../types/index";

export const setReciept = (payload: RecieptType) => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const token = getState().loginState.token;

  const { id = -1 } = payload;

  console.log("setReciept");
  console.log(payload);
  const action: RecieptAction = {
    type: "RECIEPT_SET",
    payload: {
      reciept: payload
    }
  };

  dispatch(action);
};
