import { Dispatch } from "redux";

export type setValuePayload<T> = {
  successType: string;
  failType?: string | null;
  validate?: (payload: T) => boolean;
  onSuccess?: (a: any, b:any, dispatch: Dispatch) => any;
  onFail?: (a: any, b:any, dispatch: Dispatch) => any;
};
