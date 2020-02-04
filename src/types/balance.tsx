import { UserType, ReceiptType } from "./index";

export type BalanceType = {
  id?: number;
  to_user: UserType;
  from_user: UserType;
  to_user_id?: number;
  from_user_id?: number;
  amount: number;
  receipt?: ReceiptType;
};
