import { fetchFriends } from "../api/index";
import { FRIEND_LIST_SUCCESS, FRIEND_LIST_FAIL } from "../types/index";

import { ApiMiddlewareAction } from "../types/index";
import { apiCallAction } from "./index";

export const getFriends = (): ApiMiddlewareAction =>
  apiCallAction({
    successType: FRIEND_LIST_SUCCESS,
    failType: FRIEND_LIST_FAIL,
    withToken: true,
    apiCall: fetchFriends
  });
