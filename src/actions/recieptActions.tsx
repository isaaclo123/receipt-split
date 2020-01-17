import { fetchRecieptById, fetchRecieptList } from "../api/index";

import {
  RootState,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL,
  RECIEPT_LIST_FAIL,
  RECIEPT_LIST_SUCCESS
} from "../types/index";

// export const setRecieptList = () => (dispatch: Dispatch) => {
//   const action = {
//     type: 'RECIEPT_LIST_REQUEST',
//   }
//
//   console.log("GETRECIEPTLIST")
//
//   dispatch(action)
// }

import { ApiMiddlewareAction } from "../types/index";
import { apiCallAction } from "./index";

export const getRecieptList = (): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECIEPT_LIST_SUCCESS,
    failType: RECIEPT_LIST_FAIL,
    withToken: true,
    apiCall: fetchRecieptList
  });

export const getReciept = (id: number): ApiMiddlewareAction =>
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
