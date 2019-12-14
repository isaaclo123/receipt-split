import { call, put, takeLatest } from 'redux-saga/effects'

import { fetchLogin, fetchSignup } from '../api/index'

import { TokenData, LoginData, SignupData, SignupAction } from '../types/index'

function* fetchSignupWorker(action: SignupAction) {
  const { payload } = action
  const signupPayload: SignupData = payload

  try {
      const signupData = yield call(fetchSignup, payload);

      if (signupData == null) {
        yield put({type: "SIGNUP_FAIL", payload: signupPayload});
      }

      const { username, password } = signupPayload

      const loginPayload: LoginData = {
        username,
        password
      }

      const tokenData = yield call(fetchLogin, loginPayload);

      console.log(tokenData)

      const tokenPayload: TokenData = {
        username,
        token: tokenData.access_token
      }

      yield put({type: "LOGIN_SUCCESS", payload: tokenPayload});
  } catch (e) {
      yield put({type: "SIGNUP_FAIL", payload: signupPayload});
  }
}

export function* signupSaga() {
  yield takeLatest("SIGNUP_REQUEST", fetchSignupWorker);
}
