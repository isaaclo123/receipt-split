import {
  // LoginData,
  LoginAction,
  LoginState
} from '../types/index'

const initialState: LoginState = {
  username: "",
  login: false
}

export default (state:LoginState = initialState, action: LoginAction) => {
  if (action.payload == null) {
    return state
  }

  // const { username, password }: LoginData = action.payload

  console.log("LOGIN")
  // alert(username)
  // console.log(username)
  // console.log(password)
  console.log(action.payload)

  switch (action.type) {
    case 'SET_LOGIN':
      return {
        username: action.payload.username,
        login: true
      }
    default:
      return state;
  }
}
