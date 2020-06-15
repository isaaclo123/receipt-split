import {
  UserType,

  Action,
  ErrorData,
  Failable,

  PAYMENT_SAVE_SUCCESS,
  PAYMENT_SAVE_FAIL,

  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
} from "./index";

export type PaymentType = {
  id?: number;
  date: string;
  accepted: boolean | null;
  message?: string;

  to_user_id?: number;
  from_user_id?: number;

  amount: number;

  to_user: UserType;
  from_user: UserType;
};

export type PaymentEditType = PaymentType | {
  id?: number;
  date?: string;
  accepted?: boolean | null;

  to_user_id?: number;
  from_user_id?: number;

  from_user?: UserType;

  message: string;
  amount: number;
  to_user: UserType;
};

export interface PaymentErrors extends ErrorData {
  to_user?: string;
  message?: string;
  amount?: string;
};

export type PaymentSuccessAction = Action<typeof PAYMENT_SAVE_SUCCESS, PaymentEditType>;
export type PaymentFailAction = Action<typeof PAYMENT_SAVE_FAIL, PaymentErrors>;
export type PaymentAction = PaymentSuccessAction | PaymentFailAction;
export type PaymentState = Failable<PaymentEditType, PaymentErrors>

// Payment List type

export interface PaymentListType extends ErrorData {
  payments_received: PaymentType[];
  payments_sent: PaymentType[];
}

export interface PaymentListErrors extends ErrorData {};

export type PaymentListSuccessAction = Action<typeof PAYMENT_LIST_SUCCESS, PaymentType>;
export type PaymentListFailAction = Action<typeof PAYMENT_LIST_FAIL, PaymentListErrors>;
export type PaymentListAction = PaymentSuccessAction | PaymentFailAction;
export type PaymentListState = Failable<PaymentListType, PaymentErrors>
