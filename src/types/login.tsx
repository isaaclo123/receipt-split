import { Failable, LOGIN_SUCCESS, LOGIN_FAIL } from "./index";

export interface TokenPayload {
  token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: TokenPayload;
}

interface LoginFailAction {
  type: typeof LOGIN_FAIL;
  payload: LoginErrors;
}

export type LoginAction = LoginSuccessAction | LoginFailAction;

export interface LoginData {
  login: boolean;
  token: string;

  username: string;
  password: string;
}

export interface LoginErrors {
  username?: string;
  password?: string;
}

export type LoginState = Failable<LoginData, LoginErrors>;
// {
//   username: string;
//   login: boolean;
//   token: string | null;
// }
