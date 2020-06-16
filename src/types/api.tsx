import {
  Failable,
  Dict,
  RootState
} from "./index";

export type ApiMiddlewarePayload = {
  successType?: string | null;
  failType?: string | null;

  withToken: boolean;

  shouldCallApi?: (state: RootState) => any | unknown;

  apiCall: (...args: any[]) => Promise<ApiFetchType>;
  apiCallArgs?: any[];

  onSuccess?: ((arg0: any, state: RootState) => any) | ((arg0: any) => any);
  onFail?: ((arg0: any, state: RootState) => any) | ((arg0: any) => any);

  afterSuccess?: (arg0: RootState) => ((dispatch: any, getState: any) => void) | null;
  afterFail?: (arg0: RootState) => ((dispatch: any, getState: any) => void) | null;
};

// export type ApiMiddlewareAction = Action<
//   typeof API_MIDDLEWARE_TYPE,
//   ApiMiddlewarePayload
// >;

// TODO Stub
export type ApiMiddlewareAction = any;

export type ApiFetchType = Failable<Dict, Dict>;
