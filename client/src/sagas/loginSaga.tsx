import { call, put, takeLatest } from 'redux-saga/effects'

import { fetchLogin } from '../api/index'

import { TokenData, LoginAction } from '../types/index'

function* fetchLoginWorker(action: LoginAction) {
  try {
      const { payload } = action

      const tokenData = yield call(fetchLogin, payload);

      const { username } = payload

      const tokenPayload: TokenData = {
        username,
        token: tokenData.access_token
      }

      console.log("LOGIN_SUCCESS")
      console.log(payload)

      yield put({type: "LOGIN_SUCCESS", payload: tokenPayload});
  } catch (e) {
      yield put({type: "LOGIN_FAIL", token: ""});
  }
}

export function* loginSaga() {
  yield takeLatest("LOGIN_REQUEST", fetchLoginWorker);
}
