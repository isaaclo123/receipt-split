import { fetchBalanceSumList } from "../api/index";
import { BALANCE_SUM_LIST_FAIL, BALANCE_SUM_LIST_SUCCESS } from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { apiCallAction } from "./index";

export const getBalanceSumList = (): ApiMiddlewareAction =>
  apiCallAction({
    successType: BALANCE_SUM_LIST_SUCCESS,
    failType: BALANCE_SUM_LIST_FAIL,
    withToken: true,
    apiCall: fetchBalanceSumList
  });
