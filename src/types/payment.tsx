import {
  UserType,

  Action,
  ErrorData,
  Failable,

  PAYMENT_SAVE_FAIL,
  PAYMENT_SAVE_SUCCESS
} from "./index";

export type PaymentType = {
  id?: number;
  created?: string;
  accepted?: boolean;
  message?: string;

  to_user_id?: number;
  from_user_id?: number;

  amount: number;

  to_user?: UserType | null;
  from_user?: UserType | null;
};

export interface PaymentErrors extends ErrorData {
  to_user?: string;
  message?: string;
  amount?: string;
};

export type PaymentSuccessAction = Action<typeof PAYMENT_SAVE_SUCCESS, PaymentType>;
export type PaymentFailAction = Action<typeof PAYMENT_SAVE_FAIL, PaymentErrors>;
export type PaymentAction = PaymentSuccessAction | PaymentFailAction;
export type PaymentState = Failable<PaymentType, PaymentErrors>
