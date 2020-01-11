import { Middleware } from "redux";
import {
  Action,
  RootState,
  ApiMiddlewareAction,
  ApiMiddlewarePayload,
  API_MIDDLEWARE_TYPE
} from "../types/index";

export const getToken = (getState: () => RootState) => {
  return getState().loginState.data.token;
};

export const apiCallMiddleware: Middleware = ({
  dispatch,
  getState
}) => next => async (action: Action<string, any>) => {
  if (action.type !== API_MIDDLEWARE_TYPE) {
    return next(action);
  }

  const {
    successType = null,
    failType = null,

    withToken,

    apiCall,
    apiCallArgs = [],

    onSuccess = (a: any) => a,
    onFail = (a: any) => a,

    afterSuccess = null,
    afterFail = null
  }: ApiMiddlewarePayload = action.payload;

  const args = withToken ? [...apiCallArgs, getToken(getState)] : apiCallArgs;

  const { error, errors, data } = await apiCall(...args);

  if (!error) {
    if (successType != null) {
      await dispatch({
        type: successType,
        payload: onSuccess(data)
      });
    }

    if (afterSuccess != null) {
      dispatch(afterSuccess);
    }
  } else {
    if (failType != null) {
      await dispatch({
        type: failType,
        payload: onFail(errors)
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
