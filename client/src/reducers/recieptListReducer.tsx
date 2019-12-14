import {
  RecieptData,
  RecieptAction,
  RecieptType,
  RecieptListState,
  RecieptListAction,
} from '../types/index'

const initialState: RecieptListState = {
  reciepts: []
}

export default (state:RecieptListState = initialState, {
  payload,
  type
}: RecieptListAction) => {
  if (payload == null) {
    return state
  }

  switch (type) {
    case 'RECIEPT_LIST_SUCCESS':
      return payload
    case 'RECIEPT_LIST_FAIL':
      return state
    default:
      return state
  }
}
