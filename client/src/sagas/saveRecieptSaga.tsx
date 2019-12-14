import { select, call, put, takeLatest } from 'redux-saga/effects'

import { saveRecieptById } from '../api/index'

import { RecieptType, RecieptState, RecieptSetAction } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* saveRecieptWorker(action: any) {
  const { payload }: RecieptSetAction = action
  const { id=-1 }: RecieptType = payload
  try {
      const token = yield select(getToken);

      const recieptData: RecieptType = yield call(saveRecieptById, token, id, payload);

      const recieptPayload: RecieptState = {
        reciept: recieptData
      }

      yield put({type: "RECIEPT_SAVE_SUCCESS", payload: recieptPayload});
  } catch (e) {
      const recieptPayload: RecieptState = {
        reciept: null
      }

      yield put({type: "RECIEPT_SAVE_FAIL", payload: recieptPayload});
  }
}

export function* saveRecieptSaga() {
  yield takeLatest("RECIEPT_SAVE_REQUEST", saveRecieptWorker);
}
