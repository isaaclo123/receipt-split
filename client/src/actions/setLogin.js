interface loginData {
  username:string,
  password:string
}

export const setLogin = (payload:loginData) => dispatch => {
  dispatch({
    type: 'SET_LOGIN',
    payload
  })
}
