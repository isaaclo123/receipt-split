import { Dispatch } from "redux";
import { RootState } from "../types/index";

export * from "./recieptActions";
export * from "./userActions";
// export * from "./saveReciept";
export * from "./loginActions";
// export * from "./setReciept";
export * from "./signupActions";

/* helper functions */

export const getToken = (getState: () => RootState) => {
  return getState().loginState.data.token;
};

export const getData = (
  successType: string,
  failType: string,
  withToken: boolean,
  apiCall: (...args: any[]) => any,
  ...args: any[]
) => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    const result = withToken
      ? await apiCall(getToken(getState), ...args)
      : await apiCall(...args);

    dispatch({
      type: successType,
      payload: result
    });
  } catch (e) {
    dispatch({
      type: failType,
      payload: e
    });
  }
};
