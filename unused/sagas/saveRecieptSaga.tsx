import { select, call, put, takeLatest } from 'redux-saga/effects'

import { saveReceiptById } from '../api/index'

import { ReceiptType, ReceiptState, ReceiptSetAction } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* saveReceiptWorker(action: any) {
  const { payload }: ReceiptSetAction = action
  const { id=-1 }: ReceiptType = payload
  try {
      const token = yield select(getToken);

      const receiptData: ReceiptType = yield call(saveReceiptById, token, id, payload);

      const receiptPayload: ReceiptState = {
        receipt: receiptData
      }

      yield put({type: "RECIEPT_SAVE_SUCCESS", payload: receiptPayload});
  } catch (e) {
      const receiptPayload: ReceiptState = {
        receipt: null
      }

      yield put({type: "RECIEPT_SAVE_FAIL", payload: receiptPayload});
  }
}

export function* saveReceiptSaga() {
  yield takeLatest("RECIEPT_SAVE_REQUEST", saveReceiptWorker);
}
