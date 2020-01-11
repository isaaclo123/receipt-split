import { rootReducer } from "../reducers/rootReducer";
import { API_MIDDLEWARE_TYPE } from "./index";

export * from "./consts";

export * from "./balance";
export * from "./login";
export * from "./payment";
export * from "./reciept";
export * from "./user";

export type RootState = ReturnType<typeof rootReducer>;

export interface ButtonProps {
  variant: string;
  text: string;
  handleClick: () => void;
}

export type Failable<T, E> = {
  error: boolean;
  data: T;
  errors: E;
};

export type Action<T, P> = {
  type: T;
  payload: P;
};

export type ApiMiddlewarePayload = {
  successType?: string | null;
  failType?: string | null;

  withToken: boolean;

  apiCall: (...args: any[]) => Promise<any>;
  apiCallArgs?: any[];

  onSuccess?: (arg0: any) => any;
  onFail?: (arg0: any) => any;

  afterSuccess?: Action<string, any> | null;
  afterFail?: Action<string, any> | null;
};

export type ApiMiddlewareAction = Action<
  typeof API_MIDDLEWARE_TYPE,
  ApiMiddlewarePayload
>;

export type SetDataReducerType = {
  successType: string;
  failType: string;
  initialState: Failable<any, any>;
};
