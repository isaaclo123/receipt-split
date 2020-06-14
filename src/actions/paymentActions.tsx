import { savePayment } from "../api/index";
import {
  UserType,
  PAYMENT_SAVE_FAIL,
  PAYMENT_SAVE_SUCCESS,
  PaymentType,
  PAYMENT_SET_NAME,
  PAYMENT_SET_AMOUNT,
  PAYMENT_SET_USER,
  PAYMENT_SET_MESSAGE
} from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { apiCallAction } from "./index";
import { setValueAction } from "./helpers";

export const setNewPayment = (payload: PaymentType): ApiMiddlewareAction =>
  apiCallAction({
    successType: PAYMENT_SAVE_SUCCESS,
    failType: PAYMENT_SAVE_FAIL,
    withToken: true,
    apiCall: savePayment,
    apiCallArgs: [payload]
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
