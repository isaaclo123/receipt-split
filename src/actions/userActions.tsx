import { fetchUser } from "../api/index";
import { USER_INFO_SUCCESS, USER_INFO_FAIL } from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { apiCallAction } from "./index";

export const getUser = (afterSuccess = (a: any) => null): ApiMiddlewareAction =>
  apiCallAction({
    successType: USER_INFO_SUCCESS,
    failType: USER_INFO_FAIL,
    withToken: true,
    apiCall: fetchUser,
    afterSuccess: afterSuccess
  });
