import { select, call, put, takeLatest } from 'redux-saga/effects'

import { fetchReceiptList } from '../api/index'

import { ReceiptListState, ReceiptType } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* fetchReceiptListWorker(action: any) {
  console.log("FETCHRECIEPTLISTWORKER")
  try {
      const token = yield select(getToken);

      const receiptListData: ReceiptType[] = yield call(fetchReceiptList, token);
      console.log("receiptListData")
      console.log(receiptListData)

      const receiptListPayload: ReceiptListState = {
        receipts: receiptListData
      }

      yield put({type: "RECIEPT_LIST_SUCCESS", payload: receiptListPayload});
  } catch (e) {
      const receiptListPayload: ReceiptListState = {
        receipts: []
      }

      yield put({type: "RECIEPT_LIST_FAIL", payload: receiptListPayload});
  }
}

export function* receiptListSaga() {
  yield takeLatest("RECIEPT_LIST_REQUEST", fetchReceiptListWorker);
}
