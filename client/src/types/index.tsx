// login

export interface LoginData {
  username:string;
  password:string;
}

export interface TokenData {
  username:string;
  token?: string
}

export interface LoginAction {
  type: string;
  payload: LoginData | TokenData;
}

export interface LoginState {
  username: string;
  login: boolean;
  token: string | null;
}

// signup
//
export interface SignupData {
  username:string;
  fullname:string;
  password:string;
}

export interface SignupAction {
  type: string;
  payload: SignupData;
}

export interface SignupState extends SignupData {
  signed_up: boolean;
}

// set login

export interface RecieptData {
  id: number;
}

export interface RecieptAction {
  type: string;
  payload: RecieptData;
}

// export interface RecieptItem {
//   name: string;
//   amount: number;
//   users: UserType[];
// }

// export interface RecieptState {
//   name: string;
//   amount: number;
//   owner: string;
//   users: UserType[];
//   items: RecieptItem[];
// }

// server types

export type RecieptType = {
  id?: number;
  name: string;
  amount: number;
  date: string;
  resolved?: boolean | null;
  user_id?: number
  user?: UserType; //TODO
  users?: UserType[]; //TODO
  balances?: BalanceType[]
  reciept_items?: RecieptItemType[]
}

export type RecieptItemType = {
  id?: number;
  name: string;
  amount: number;
  users?: UserType[]; //TODO
  reciept_id?: number;
  reciept?: RecieptType
}

export type UserType = {
  id?: number;
  friend_of_id?: number;
  friends?: UserType[]

  username: string
  fullname?: string

  reciepts?: RecieptType
  reciept_items?: number;
}

export type BalanceType = {
  id?: number;
  to_user: UserType;
  from_user: UserType;
  to_user_id?: number;
  from_user_id?: number;
  amount: number;
  reciept: RecieptType;
}

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
}

// button

export interface ButtonProps {
  variant: string;
  text: string;
  handleClick: () => void;
}
