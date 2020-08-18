import { Dispatch } from "redux";
import {
  RootState,
  ApiMiddlewarePayload,
  setValuePayload
} from "../types/index";

export const getToken = (getState: () => RootState) => {
  return getState().loginState.data.token;
};

export const apiCallAction = (payload: ApiMiddlewarePayload) => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const {
    successType = null,
    failType = null,

    withToken,

    shouldCallApi = (state: any) => null,

    apiCall,
    apiCallArgs = [],

    onSuccess = (a: any, b:any) => a,
    onFail = (a: any, b:any) => a,

    afterSuccess = (a: any) => null,
    afterFail = (a: any) => null
  }: ApiMiddlewarePayload = payload;

  const shouldCall = shouldCallApi(getState());

  const callData =
    shouldCall != null
      ? {
          modified: false, // TODO
          error: false,
          errors: {
            error: "No Proper SuccessType Given, Speak with developer"
          },
          data: shouldCall
        }
      : await apiCall(
          ...(withToken ? [...apiCallArgs, getToken(getState)] : apiCallArgs)
        );

  const { error, errors, data } = callData;

  if (!error) {
    if (successType != null) {
      await dispatch({
        type: successType,
        payload: shouldCall != null ? data : onSuccess(data, getState())
      });
    }

    const nextResult = afterSuccess(getState());

    if (nextResult != null) {
      nextResult(dispatch, getState);
    }
  } else {
    if (failType != null) {
      console.log(await dispatch({
        type: failType,
        payload: shouldCall != null ? errors : onFail(errors, getState())
      }));
    }

    const nextResult = afterFail(getState());

    if (nextResult != null) {
      nextResult(dispatch, getState);
    }
  }
};

export const setValueAction = <T extends {}>({
  successType,
  failType = null,
  validate = (a: T) => true,
  onSuccess = (payload: any, state:any) => payload,
  onFail = (payload: any, state:any) => payload,
  }: setValuePayload<T>) => (payload: T, ids: number[] = []) => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  if (validate(payload)) {
    dispatch({
      type: successType,
      payload: {
        ids,
        data: onSuccess(payload, getState(), dispatch),
      }
    });
  } else if (failType != null) {
    dispatch({
      type: failType,
      payload: {
        ids,
        data: onFail(payload, getState(), dispatch),
      }
    });
  }
};
