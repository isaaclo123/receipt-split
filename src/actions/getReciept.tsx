import { Dispatch } from "redux";

import { fetchRecieptList } from "../api/index";

import {
  RootState,
  RECIEPT_LIST_FAIL,
  RECIEPT_LIST_SUCCESS
} from "../types/index";

import { getToken } from "./index";

// export const setRecieptList = () => (dispatch: Dispatch) => {
//   const action = {
//     type: 'RECIEPT_LIST_REQUEST',
//   }
//
//   console.log("GETRECIEPTLIST")
//
//   dispatch(action)
// }

export const getRecieptList = () => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  try {
    const token = getToken(getState);

    if (!token) {
      dispatch({
        type: RECIEPT_LIST_FAIL
      });
    }

    const result = await fetchRecieptList(token);

    dispatch({
      type: RECIEPT_LIST_SUCCESS,
      payload: result
    });
  } catch (e) {
    dispatch({
      type: RECIEPT_LIST_FAIL
    });
  }
};

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
