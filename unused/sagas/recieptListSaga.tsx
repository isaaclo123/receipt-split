import { select, call, put, takeLatest } from 'redux-saga/effects'

import { fetchReceiptList } from '../api/index'

import { ReceiptListState, ReceiptType } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* fetchReceiptListWorker(action: any) {
  console.log("FETCHRECEIPTLISTWORKER")
  try {
      const token = yield select(getToken);

      const receiptListData: ReceiptType[] = yield call(fetchReceiptList, token);
      console.log("receiptListData")
      console.log(receiptListData)

      const receiptListPayload: ReceiptListState = {
        receipts: receiptListData
      }

      yield put({type: "RECEIPT_LIST_SUCCESS", payload: receiptListPayload});
  } catch (e) {
      const receiptListPayload: ReceiptListState = {
        receipts: []
      }

      yield put({type: "RECEIPT_LIST_FAIL", payload: receiptListPayload});
  }
}

export function* receiptListSaga() {
  yield takeLatest("RECEIPT_LIST_REQUEST", fetchReceiptListWorker);
}
