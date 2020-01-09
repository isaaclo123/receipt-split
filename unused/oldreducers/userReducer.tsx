import {
  UserType,
  UserAction,
  UserRequestAction,
  UserState,
} from '../types/index'

const initialState: UserState = {
  user: null,
}

export default (state:UserState = initialState, {
  payload,
  type
}: UserAction) => {
  if (payload == null) {
    return state
  }

  const { user }: UserState = payload
  console.log(payload)

  // alert(username)
  // console.log(username)
  // console.log(password)

  switch (type) {
    case 'USER_INFO_SUCCESS':
      return payload
    case 'USER_INFO_FAIL':
      return payload
    default:
      return state;
  }
}
