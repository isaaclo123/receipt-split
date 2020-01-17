import {
  RootState,
  Action,
  Failable,
  Dict,
  API_MIDDLEWARE_TYPE
} from "./index";

export type ApiMiddlewarePayload = {
  successType?: string | null;
  failType?: string | null;

  withToken: boolean;

  shouldCallApi?: (state: RootState) => any | unknown;

  apiCall: (...args: any[]) => Promise<ApiFetchType>;
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

export type ApiFetchType = Failable<Dict, Dict>;
