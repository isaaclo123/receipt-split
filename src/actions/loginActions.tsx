import { fetchUser, fetchLogin, fetchSignup, initApiFetcher } from "../api/index";
import { TOKEN_LOCALSTORAGE } from "../types/index";
import { batch } from "react-redux";
import {
  ApiMiddlewareAction,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_INFO_SUCCESS,
  LoginPayload,
  SignupPayload,
  RootState
} from "../types/index";
import {
  removeToken,
  getToken,
  storeToken
} from "../api/index";
import { apiCallAction } from "./index";
// import { disconnect } from "cluster";

export const logOut = () => (dispatch: any) => {
  return dispatch({
    type: LOGIN_FAIL,
    payload: {}
  })
}
//
// export const setToken = () => async (dispatch: any, getState: () => RootState) => {
//   // TODO deleteToken on api fail??
//   if (getState().loginState.error) {
//     removeToken();
//     return;
//   }
//
//   const token = getToken();
//
//   if (token == null) {
//     return deleteToken()(dispatch);
//   }
//
//   const userData = await fetchUser(token);
//
//   if (userData.error) {
//     console.log("Error with UserData setToken");
//     console.log(userData.error);
//     return deleteToken()(dispatch);
//   }
//
//   batch(() => {
//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: {
//         token
//       }
//     });
//     dispatch({
//       type: USER_INFO_SUCCESS,
//       payload: userData
//     });
//   });
// }

export const setLogin = (payload: LoginPayload): ApiMiddlewareAction =>
  apiCallAction({
    successType: LOGIN_SUCCESS,
    failType: LOGIN_FAIL,
    withToken: false,
    apiCall: fetchLogin,
    apiCallArgs: [payload],
    onSuccess: ({ access_token = "" }: any) => {
      // set token in localStorage
      return {
        token: access_token
      };
    }
  });

export const setSignup = (payload: SignupPayload): ApiMiddlewareAction =>
  apiCallAction({
    failType: LOGIN_FAIL,
    withToken: false,
    apiCall: fetchSignup,
    apiCallArgs: [payload],

    afterSuccess: () => setLogin({
      username: payload.username,
      password: payload.password
    })
  });
