import {
  fetchReceiptById,
  fetchReceiptList,
  saveReceiptById
} from "../api/index";

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
  RECIEPT_ADD_RECIEPT_ITEM,
  RECIEPT_DELETE_RECIEPT_ITEM,
  RECIEPT_ITEM_SET_NAME,
  RECIEPT_ITEM_SET_AMOUNT,
  RECIEPT_ITEM_ADD_USER,
  RECIEPT_ITEM_DELETE_USER,
  ReceiptType,
  ReceiptItemType,
  UserType,
  EDIT_DATA_APPEND,
  EDIT_DATA_PREPEND
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { setValueAction, apiCallAction } from "./index";

export const getReceiptList = (): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECIEPT_LIST_SUCCESS,
    failType: RECIEPT_LIST_FAIL,
    withToken: true,
    apiCall: fetchReceiptList
  });

export const getReceipt = (id: number): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECIEPT_ID_SUCCESS,
    failType: RECIEPT_ID_FAIL,
    withToken: true,
    // shouldCallApi: (state: RootState) => state.receiptDictState.data[id], TODO
    // onSuccess: (cur: any) => Object.assign({}, prev, cur),
    apiCall: fetchReceiptById,
    apiCallArgs: [id]
  });

export const saveReceipt = (
  id: number,
  payload: ReceiptType
): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECIEPT_ID_SUCCESS,
    failType: RECIEPT_ID_FAIL,
    withToken: true,
    apiCall: saveReceiptById,
    apiCallArgs: [id, payload]
  });

// export const getReceipt = (payload: ReceiptPayload) => (dispatch: Dispatch) => {
//   console.log("getReceipt");
//   console.log(payload);
//   const action: ReceiptRequestAction = {
//     type: "RECIEPT_ID_REQUEST",
//     payload
//   };
//
//   dispatch(action);
// };

export const setReceiptName = setValueAction<string>({
  successType: RECIEPT_SET_NAME
});
export const setReceiptAmount = setValueAction<number>({
  successType: RECIEPT_SET_AMOUNT
});
export const setReceiptDate = setValueAction<string>({
  successType: RECIEPT_SET_DATE
});
export const addReceiptUser = (user: UserType) =>
  setValueAction<UserType>({
    successType: RECIEPT_ADD_USER
  })(user, [EDIT_DATA_APPEND]);

export const deleteReceiptUser = (id: number) =>
  setValueAction<{}>({
    successType: RECIEPT_DELETE_USER
  })({}, [id]);

export const addReceiptItem = () =>
  setValueAction<ReceiptItemType>({
    successType: RECIEPT_ADD_RECIEPT_ITEM
  })(
    {
      name: "New Receipt Item",
      amount: 0,
      users: []
    },
    [EDIT_DATA_PREPEND]
  );

export const deleteReceiptItem = (id: number) =>
  setValueAction<{}>({
    successType: RECIEPT_DELETE_RECIEPT_ITEM
  })({}, [id]);

export const setReceiptItemName = (name: string, id: number) =>
  setValueAction<string>({
    successType: RECIEPT_ITEM_SET_NAME
  })(name, [id]);

export const setReceiptItemAmount = (amount: number, id: number) =>
  setValueAction<number>({
    successType: RECIEPT_ITEM_SET_AMOUNT
  })(amount, [id]);

export const addReceiptItemUser = (user: UserType, id: number) =>
  setValueAction<UserType>({
    successType: RECIEPT_ITEM_ADD_USER
  })(user, [id, EDIT_DATA_APPEND]);

export const deleteReceiptItemUser = (id: number, id2: number) =>
  setValueAction<{}>({
    successType: RECIEPT_ITEM_DELETE_USER
  })({}, [id, id2]);
