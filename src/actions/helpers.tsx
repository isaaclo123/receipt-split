import { Middleware, Dispatch } from "redux";
import {
  Action,
  RootState,
  ApiMiddlewareAction,
  ApiMiddlewarePayload,
  API_MIDDLEWARE_TYPE,
  setValuePayload
} from "../types/index";

export const getToken = (getState: () => RootState) => {
  return getState().loginState.data.token;
};

export const apiCallMiddleware: Middleware = ({
  dispatch,
  getState
}) => next => async (action: Action<string, any>) => {
  console.log("START ACTION " + action.type);
  console.log(action);
  console.log("END ACTION");
  if (action.type !== API_MIDDLEWARE_TYPE) {
    return next(action);
  }

  const {
    successType = null,
    failType = null,

    withToken,

    shouldCallApi = (state: any) => null,

    apiCall,
    apiCallArgs = [],

    onSuccess = (a: any) => a,
    onFail = (a: any) => a,

    afterSuccess = null,
    afterFail = null
  }: ApiMiddlewarePayload = action.payload;

  const shouldCall = shouldCallApi(getState());

  const callData =
    shouldCall != null
      ? {
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
        payload: shouldCall != null ? data : onSuccess(data)
      });
    }

    if (afterSuccess != null) {
      dispatch(afterSuccess);
    }
  } else {
    if (failType != null) {
      await dispatch({
        type: failType,
        payload: shouldCall != null ? errors : onFail(errors)
      });
    }

    if (afterFail != null) {
      dispatch(afterFail);
    }
  }
};

export const apiCallAction = (
  payload: ApiMiddlewarePayload
): ApiMiddlewareAction => {
  return {
    type: API_MIDDLEWARE_TYPE,
    payload
  };
};

export const setValueAction = <T extends {}>({
  successType,
  failType = null,
  validate = (a: T) => true
}: setValuePayload<T>) => (payload: T, ids: number[] = []) => (
  dispatch: Dispatch
) => {
  if (validate(payload)) {
    dispatch({
      type: successType,
      payload: {
        ids,
        data: payload
      }
    });
  } else if (failType != null) {
    dispatch({
      type: failType,
      payload: {
        ids,
        data: payload
      }
    });
  }
};
