import {
  SignupAction,
  SignupState,
  SignupData
} from '../types/index'

const initialState: SignupState = {
  username: "",
  password: "",
  fullname: "",
  signed_up: false
}

export default (state:SignupState = initialState, action: SignupAction) => {
  const { payload = null, type } = action

  if (payload == null) {
    return state
  }

  switch (type) {
    case 'SIGNUP_RESET':
      return initialState

    case 'SIGNUP_SUCCESS':
      const { username, password, fullname }: SignupData = payload

      return {
        username,
        password,
        fullname,
        signed_up: true
      }

    case 'SIGNUP_FAIL':
      return {
        username,
        password,
        fullname,
        signed_up: false
      }

    default:
      return state;
  }
}
