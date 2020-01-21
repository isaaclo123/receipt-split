import { Dispatch } from "redux";
import { fetchRecieptById, fetchRecieptList } from "../api/index";

import {
  // RootState,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL,
  RECIEPT_LIST_FAIL,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_SET_NAME,
  RECIEPT_SET_AMOUNT,
  RECIEPT_SET_DATE
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { setValueAction, apiCallAction } from "./index";

export const getRecieptList = () =>
  apiCallAction({
    successType: RECIEPT_LIST_SUCCESS,
    failType: RECIEPT_LIST_FAIL,
    withToken: true,
    apiCall: fetchRecieptList
  });

export const getReciept = (id: number) =>
  apiCallAction({
    successType: RECIEPT_ID_SUCCESS,
    failType: RECIEPT_ID_FAIL,
    withToken: true,
    // shouldCallApi: (state: RootState) => state.recieptDictState.data[id], TODO
    apiCall: fetchRecieptById,
    apiCallArgs: [id]
  });

// export const getReciept = (payload: RecieptPayload) => (dispatch: Dispatch) => {
//   console.log("getReciept");
//   console.log(payload);
//   const action: RecieptRequestAction = {
//     type: "RECIEPT_ID_REQUEST",
//     payload
//   };
//
//   dispatch(action);
// };

// export const setRecieptName = setValueAction<string>({
//   successType: RECIEPT_SET_NAME,
//   validate: (s: string) => {
//     console.log(s);
//     return true;
//   }
// });

export const setRecieptName = (payload: string) => (dispatch: Dispatch) => {
  console.log("payload");
  console.log(payload);
  dispatch({
    type: RECIEPT_SET_NAME,
    payload
  });
};

export const setRecieptAmount = setValueAction<number>({
  successType: RECIEPT_SET_AMOUNT
});
export const setRecieptDate = setValueAction<string>({
  successType: RECIEPT_SET_DATE
});
