import { Dispatch } from "redux";
import { batch } from "react-redux";
import { savePayment, fetchPaymentList } from "../api/index";
import {
  PaymentType,
  UserType,
  PAYMENT_SAVE_FAIL,
  PAYMENT_SAVE_SUCCESS,
  PaymentEditType,
  PAYMENT_SET_NAME,
  PAYMENT_SET_AMOUNT,
  PAYMENT_SET_USER,
  PAYMENT_SET_MESSAGE,

  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,

  PAYMENT_LIST_ADD_PAYMENT,

  EDIT_DATA_PREPEND,
  RootState,
  PaymentState,
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";

import {
  apiCallAction,
  getBalanceSumList,
} from "./index";

import { setValueAction } from "./helpers";

export const addNewPayment = (payment: PaymentType) =>
  setValueAction<PaymentType>({
    successType: PAYMENT_LIST_ADD_PAYMENT
  })(
    payment,
    [EDIT_DATA_PREPEND]
  );

export const setNewPayment = (payload: PaymentEditType): ApiMiddlewareAction =>
  apiCallAction({
    successType: PAYMENT_SAVE_SUCCESS,
    failType: PAYMENT_SAVE_FAIL,
    withToken: true,
    apiCall: savePayment,
    apiCallArgs: [payload],
    afterSuccess: ({paymentState}: RootState) => {
      return addNewPayment(paymentState.data as PaymentType);
    }
  });

export const setPaymentName = setValueAction<string>({
  successType: PAYMENT_SET_NAME
})

export const setPaymentAmount = setValueAction<number>({
  successType: PAYMENT_SET_AMOUNT
})

export const setPaymentMessage = setValueAction<string>({
  successType: PAYMENT_SET_MESSAGE
})

export const setPaymentUser = setValueAction<UserType>({
  successType: PAYMENT_SET_USER
})

// Payment list

export const getPaymentList = (): ApiMiddlewareAction =>
  apiCallAction({
    successType: PAYMENT_LIST_SUCCESS,
    failType: PAYMENT_LIST_FAIL,
    withToken: true,
    apiCall: fetchPaymentList,
  });


export const getPaymentListAndBalances = () => (dispatch: Dispatch) => {
  batch(() => {
    dispatch(getBalanceSumList());
    dispatch(getPaymentList());
  });
};
