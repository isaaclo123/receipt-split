import { Dispatch } from "redux";
import { batch } from "react-redux";
import { savePayment, fetchPaymentList, confirmPayment, fetchPaymentListArchive } from "../api/index";
import {
  PaymentType,
  UserType,
  PAYMENT_SAVE_FAIL,
  PAYMENT_SAVE_SUCCESS,
  PaymentEditType,

  PAYMENT_STATE_SET,

  PAYMENT_SET_NAME,
  PAYMENT_SET_AMOUNT,
  PAYMENT_SET_MAX_AMOUNT,
  PAYMENT_SET_USER,
  PAYMENT_SET_MESSAGE,

  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
  PAYMENT_LIST_ADD_PAYMENT,

  PAYMENT_LIST_SET_ACCEPTED_SUCCESS,
  PAYMENT_LIST_SET_ACCEPTED_FAIL,

  EDIT_DATA_PREPEND,
  RootState,
  Dict,
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
    // onSuccess: (payment: PaymentType, state: RootState, dispatch: Dispatch) => {
    //   getPaymentListAndBalances()(dispatch);

    //   return payment
    // }
  })(
    payment,
    [EDIT_DATA_PREPEND]
  );

export const setNewPayment = ({max_amount, ...payload}: PaymentEditType): ApiMiddlewareAction =>
  apiCallAction({
    successType: PAYMENT_SAVE_SUCCESS,
    failType: PAYMENT_SAVE_FAIL,
    withToken: true,
    apiCall: savePayment,
    apiCallArgs: [{...payload}],
    afterSuccess: ({ paymentState }: RootState) => {
      return addNewPayment(paymentState.data as PaymentType);
    }
  });

export const setPayment = ({
  amount = 0.0,
  message = "",
  to_user = "",
}: Dict) => (dispatch: Dispatch, getState: () => RootState) => {
  batch(() => {
    const actions = [
      setPaymentAmount(amount),
      setPaymentMaxAmount(amount),
      setPaymentMessage(message),
      setPaymentUser(to_user)
    ]

    actions.forEach((action) => {
      action(dispatch, getState)
    })
  });
};

export const setPaymentName = setValueAction<string>({
  successType: PAYMENT_SET_NAME
})

export const setPaymentAmount = setValueAction<number>({
  successType: PAYMENT_SET_AMOUNT
})

export const setPaymentMaxAmount = setValueAction<number>({
  successType: PAYMENT_SET_MAX_AMOUNT
})

export const setPaymentMessage = setValueAction<string>({
  successType: PAYMENT_SET_MESSAGE
})

export const setPaymentUser = setValueAction<UserType>({
  successType: PAYMENT_SET_USER
})

// Payment list

export const getPaymentList = (archive = true): ApiMiddlewareAction =>
  apiCallAction({
    successType: PAYMENT_LIST_SUCCESS,
    failType: PAYMENT_LIST_FAIL,
    withToken: true,
    apiCall: archive ? fetchPaymentListArchive : fetchPaymentList,
  });


export const getPaymentListAndBalances = (archive = true) => (dispatch: Dispatch) => {
  batch(() => {
    dispatch(getBalanceSumList());
    dispatch(getPaymentList(archive));
  });
};

export const setPaymentConfirm = (
  id: number,
  action: "accept" | "reject",
  index: number,
): ApiMiddlewareAction =>
  apiCallAction({
    successType: PAYMENT_LIST_SET_ACCEPTED_SUCCESS,
    failType: PAYMENT_LIST_SET_ACCEPTED_FAIL,
    withToken: true,
    apiCall: confirmPayment,
    apiCallArgs: [id, action],
    onSuccess: (payment: PaymentType, { paymentListState }: RootState) => {
      const { id = -1 } = payment;
      const { data } = paymentListState;

      if (id === -1) {
        return data;
      }

      return Object.assign({}, data, {
        payments_received: [
          ...data.payments_received.slice(0, index),
          payment,
          ...data.payments_received.slice(index + 1),
        ]
      });

    },
    // afterSuccess: ({ paymentState })

    afterSuccess: () => {
      // TODO
      return getPaymentListAndBalances(false);
    }
  });
