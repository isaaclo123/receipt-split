import { fetchUser } from "../api/index";
import { getData } from "./index";
import { USER_INFO_SUCCESS, USER_INFO_FAIL } from "../types/index";

export const getUser = () =>
  getData(USER_INFO_SUCCESS, USER_INFO_FAIL, true, fetchUser);
