import {
  fetchReceiptById,
  fetchReceiptList,
  saveReceiptById,
  deleteReceiptById
} from "../api/index";

import {
  // RootState,
  RECEIPT_ID_SUCCESS,
  RECEIPT_ID_FAIL,
  RECEIPT_LIST_FAIL,
  RECEIPT_LIST_SUCCESS,
  RECEIPT_SET_NAME,
  RECEIPT_SET_AMOUNT,
  RECEIPT_SET_DATE,
  RECEIPT_ADD_USER,
  RECEIPT_DELETE_USER,
  RECEIPT_ADD_RECEIPT_ITEM,
  RECEIPT_DELETE_RECEIPT_ITEM,
  RECEIPT_ITEM_SET_NAME,
  RECEIPT_ITEM_SET_AMOUNT,
  RECEIPT_ITEM_ADD_USER,
  RECEIPT_ITEM_DELETE_USER,
  RECEIPT_DELETE_SUCCESS,
  RECEIPT_DELETE_FAIL,
  RECEIPT_INDEX_DELETE_MAP,
  ReceiptType,
  ReceiptItemType,
  UserType,
  EDIT_DATA_APPEND,
  EDIT_DATA_PREPEND,
  RECEIPT_EDIT_RESET,
  RootState,
  // RootState,
  // ReceiptAction
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { setValueAction, apiCallAction } from "./index";

export const getReceiptList = (): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECEIPT_LIST_SUCCESS,
    failType: RECEIPT_LIST_FAIL,
    withToken: true,
    apiCall: fetchReceiptList
  });


export const resetReceipt = setValueAction<{}>({
  successType: RECEIPT_EDIT_RESET,
  onSuccess: (payload: any, { userState }: RootState) => {
    return userState.data
  }
})({}, []);

export const getReceipt = (id: number): ApiMiddlewareAction => {
  if (id === -1) {
    return resetReceipt;
  }

  return apiCallAction({
      successType: RECEIPT_ID_SUCCESS,
      failType: RECEIPT_ID_FAIL,
      withToken: true,
      // shouldCallApi: (state: RootState) => state.receiptDictState.data[id], TODO
      // onSuccess: (cur: any) => Object.assign({}, prev, cur),
      apiCall: fetchReceiptById,
      apiCallArgs: [id]
    });
}

export const saveReceipt = (
  id: number,
  payload: ReceiptType
): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECEIPT_ID_SUCCESS,
    failType: RECEIPT_ID_FAIL,
    withToken: true,
    apiCall: saveReceiptById,
    apiCallArgs: [id, payload]
  });

export const deleteReceiptInList = (successType: string, index: number) =>
  setValueAction<{}>({
    successType
  })({}, [index]);

export const deleteReceipt = (
  id: number,
): ApiMiddlewareAction =>
  apiCallAction({
    successType: RECEIPT_DELETE_SUCCESS,
    failType: RECEIPT_DELETE_FAIL,
    withToken: true,
    apiCall: deleteReceiptById,
    apiCallArgs: [id],
    afterSuccess: (state: any) => {
      const data = state.receiptListState.data;

      for (const [listName, receipt] of Object.entries(data)) {
        if (!Array.isArray(receipt)) {
          return null;
        }

        for (let i = 0; i < receipt.length; i++) {
          if (receipt[i].id === id) {
            const result = RECEIPT_INDEX_DELETE_MAP[listName];

            if (result == null) {
              return null;
            }

            return deleteReceiptInList(result, i);
          }
        }
      }

      return null;
    }
  });

export const setReceiptName = setValueAction<string>({
  successType: RECEIPT_SET_NAME
});
export const setReceiptAmount = setValueAction<number>({
  successType: RECEIPT_SET_AMOUNT
});
export const setReceiptDate = setValueAction<string>({
  successType: RECEIPT_SET_DATE
});
export const addReceiptUser = (user: UserType) =>
  setValueAction<UserType>({
    successType: RECEIPT_ADD_USER
  })(user, [EDIT_DATA_APPEND]);

export const deleteReceiptUser = (id: number) =>
  setValueAction<{}>({
    successType: RECEIPT_DELETE_USER
  })({}, [id]);

export const addReceiptItem = () =>
  setValueAction<ReceiptItemType>({
    successType: RECEIPT_ADD_RECEIPT_ITEM
  })(
    {
      name: "",
      amount: 0,
      users: []
    },
    [EDIT_DATA_PREPEND]
  );

export const deleteReceiptItem = (id: number) =>
  setValueAction<{}>({
    successType: RECEIPT_DELETE_RECEIPT_ITEM
  })({}, [id]);

export const setReceiptItemName = (name: string, id: number) =>
  setValueAction<string>({
    successType: RECEIPT_ITEM_SET_NAME
  })(name, [id]);

export const setReceiptItemAmount = (amount: number, id: number) =>
  setValueAction<number>({
    successType: RECEIPT_ITEM_SET_AMOUNT
  })(amount, [id]);

export const addReceiptItemUser = (user: UserType, id: number) =>
  setValueAction<UserType>({
    successType: RECEIPT_ITEM_ADD_USER
  })(user, [id, EDIT_DATA_APPEND]);

export const deleteReceiptItemUser = (id: number, id2: number) =>
  setValueAction<{}>({
    successType: RECEIPT_ITEM_DELETE_USER
  })({}, [id, id2]);
