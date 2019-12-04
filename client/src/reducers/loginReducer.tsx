import { LoginData, LoginAction } from '../actions/setLogin'

export interface LoginState {
  username: string;
  login: boolean;
}

const initialState = {
  username: "",
  login: false
}

export default (state:LoginState = initialState, action: LoginAction) => {
  if (action.payload == null) {
    return initialState
  }

  const { username, password }: LoginData = action.payload

  console.log(username)
  console.log(password)

  switch (action.type) {
    case 'SET_LOGIN':
      return {
        username,
        login: true
      }
    default:
      return initialState;
  }
}
