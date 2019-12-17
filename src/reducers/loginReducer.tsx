import {
  // LoginData,
  LoginAction,
  TokenData,
  LoginState
} from '../types/index'

const initialState: LoginState = {
  username: "",
  login: false,
  token: null
}

export default (state:LoginState = initialState, action: LoginAction) => {
  const { payload = null, type } = action

  if (payload == null) {
    return state
  }

  // const { username, password }: LoginData = action.payload

  // alert(username)
  // console.log(username)
  // console.log(password)

  switch (type) {
    case 'LOGIN_SUCCESS':
      console.log("SUCCESS")
      const { username, token = "" }: TokenData = payload

      if (token === "") {
        return {
          username,
          login: false,
          token: null
        }
      }

      return {
        username,
        login: true,
        token
      }
    case 'LOGIN_FAIL':
      console.log("FAIL")
      return {
        username: payload.username,
        login: false,
        token: null
      }
    default:
      return state;
  }
}
