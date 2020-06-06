import { select, call, put, takeLatest } from 'redux-saga/effects'

import { fetchReceiptById } from '../api/index'

import { ReceiptData, ReceiptType, ReceiptState, ReceiptRequestAction } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* fetchReceiptWorker(action: any) {
  const { payload }: ReceiptRequestAction = action
  const { id=-1 }: ReceiptData = payload
  try {
      const token = yield select(getToken);

      const receiptData: ReceiptType = yield call(fetchReceiptById, token, id);

      const receiptPayload: ReceiptState = {
        receipt: receiptData
      }

      yield put({type: "RECEIPT_ID_SUCCESS", payload: receiptPayload});
  } catch (e) {
      const receiptPayload: ReceiptState = {
        receipt: null
      }

      yield put({type: "RECEIPT_ID_FAIL", payload: receiptPayload});
  }
}

export function* receiptSaga() {
  yield takeLatest("RECEIPT_ID_REQUEST", fetchReceiptWorker);
}
