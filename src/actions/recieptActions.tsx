import { fetchRecieptList } from "../api/index";

import { RECIEPT_LIST_FAIL, RECIEPT_LIST_SUCCESS } from "../types/index";

import { getData } from "./index";

// export const setRecieptList = () => (dispatch: Dispatch) => {
//   const action = {
//     type: 'RECIEPT_LIST_REQUEST',
//   }
//
//   console.log("GETRECIEPTLIST")
//
//   dispatch(action)
// }

export const getRecieptList = () =>
  getData(RECIEPT_LIST_SUCCESS, RECIEPT_LIST_FAIL, true, fetchRecieptList);

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
