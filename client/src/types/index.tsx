import { List } from 'immutable'
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
//
export interface RecieptData {
  id: number;
}

export interface RecieptAction {
  type: string;
  payload: RecieptData;
}

export interface RecieptItem {
  name: string;
  amount: number;
  users: List<string>;
}

export interface RecieptState {
  name: string;
  amount: number;
  owner: string;
  users: List<string>;
  items: List<RecieptItem>;
}
