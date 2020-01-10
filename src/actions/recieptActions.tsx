import { fetchRecieptList } from "../api/index";

import { RECIEPT_LIST_FAIL, RECIEPT_LIST_SUCCESS } from "../types/index";

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
