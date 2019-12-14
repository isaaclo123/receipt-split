import { select, call, put, takeLatest } from 'redux-saga/effects'

import { fetchRecieptById } from '../api/index'

import { RecieptData, RecieptType, RecieptState, RecieptRequestAction } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* fetchRecieptWorker(action: any) {
  const { payload }: RecieptRequestAction = action
  const { id=-1 }: RecieptData = payload
  try {
      const token = yield select(getToken);

      const recieptData: RecieptType = yield call(fetchRecieptById, token, id);

      const recieptPayload: RecieptState = {
        reciept: recieptData
      }

      yield put({type: "RECIEPT_ID_SUCCESS", payload: recieptPayload});
  } catch (e) {
      const recieptPayload: RecieptState = {
        reciept: null
      }

      yield put({type: "RECIEPT_ID_FAIL", payload: recieptPayload});
  }
}

export function* recieptSaga() {
  yield takeLatest("RECIEPT_ID_REQUEST", fetchRecieptWorker);
}
