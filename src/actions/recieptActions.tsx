import { fetchRecieptById, fetchRecieptList } from "../api/index";

import {
  // RootState,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL,
  RECIEPT_LIST_FAIL,
  RECIEPT_LIST_SUCCESS,
  RECIEPT_SET_NAME,
  RECIEPT_SET_AMOUNT,
  RECIEPT_SET_DATE,
  RECIEPT_ADD_USER,
  RECIEPT_DELETE_USER,
  UserType,
  EDIT_DATA_APPEND,
  EDIT_DATA_DELETE
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { setValueAction, apiCallAction } from "./index";

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

export const setRecieptName = setValueAction<string>({
  successType: RECIEPT_SET_NAME,
  validate: (s: string) => {
    console.log(s);
    return true;
  }
});
export const setRecieptAmount = setValueAction<number>({
  successType: RECIEPT_SET_AMOUNT
});
export const setRecieptDate = setValueAction<string>({
  successType: RECIEPT_SET_DATE
});
export const addRecieptUser = (user: UserType) =>
  setValueAction<UserType>({
    successType: RECIEPT_ADD_USER
  })(user, [EDIT_DATA_APPEND]);

export const deleteRecieptUser = (id: number) =>
  setValueAction<{}>({
    successType: RECIEPT_DELETE_USER
  })({}, [id]);
