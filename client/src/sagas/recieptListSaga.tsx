import { select, call, put, takeLatest } from 'redux-saga/effects'

import { fetchRecieptList } from '../api/index'

import { RecieptListState, RecieptType } from '../types/index'

const getToken = (state:any) => state.loginState.token

function* fetchRecieptListWorker(action: any) {
  console.log("FETCHRECIEPTLISTWORKER")
  try {
      const token = yield select(getToken);

      const recieptListData: RecieptType[] = yield call(fetchRecieptList, token);
      console.log("recieptListData")
      console.log(recieptListData)

      const recieptListPayload: RecieptListState = {
        reciepts: recieptListData
      }

      yield put({type: "RECIEPT_LIST_SUCCESS", payload: recieptListPayload});
  } catch (e) {
      yield put({type: "RECIEPT_LIST_FAIL", payload: []});
  }
}

export function* recieptListSaga() {
  yield takeLatest("RECIEPT_LIST_REQUEST", fetchRecieptListWorker);
}
