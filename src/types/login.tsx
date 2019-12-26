import { LOGIN_SUCCESS, LOGIN_FAIL } from "./index";

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenData {
  username: string;
  token: string;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: TokenData;
}

interface LoginFailAction {
  type: typeof LOGIN_FAIL;
  payload: null;
}

export type LoginAction = LoginSuccessAction | LoginFailAction;

export interface LoginState {
  username: string;
  login: boolean;
  token: string | null;
}
