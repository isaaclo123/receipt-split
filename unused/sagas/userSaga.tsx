import { select, call, put, takeLatest } from "redux-saga/effects";

import { fetchUser } from "../api/index";

import { UserType, UserState } from "../types/index";

const getToken = (state: any) => state.loginState.token;

function* fetchUserWorker(action: any) {
  console.log("GETUSER ETCH");
  try {
    const token = yield select(getToken);

    console.log("BEFORE FETCHUSER");
    const userData: UserType = yield call(fetchUser, token);

    console.log(userData);
    console.log("AFTER FETCHUSER");

    const userPayload: UserState = {
      user: userData
    };
    console.log(userPayload);

    yield put({ type: "USER_INFO_SUCCESS", payload: userPayload });
  } catch (e) {
    const userPayload: UserState = {
      user: null
    };

    yield put({ type: "USER_INFO_FAIL", payload: userPayload });
  }
}

export function* userSaga() {
  yield takeLatest("USER_INFO_REQUEST", fetchUserWorker);
}
