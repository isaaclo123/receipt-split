import { UserType } from "./index";

export type PaymentType = {
  id?: number;
  created?: string;
  accepted?: boolean;
  message?: string;

  to_user_id?: number;
  from_user_id?: number;

  amount: number;

  to_user: UserType;
  from_user: UserType;
};
