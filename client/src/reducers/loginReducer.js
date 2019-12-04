interface loginData {
  username:string,
  password:string
}

export default (state:bool = false, action) => {
  // const { username, password } = action.payload

  // console.log(username)
  // console.log(password)
  if (action.payload == null) {
    return false;
  }

  const payload:loginData = action.payload

  switch (action.type) {
    case 'SET_LOGIN':
      return true
    default:
      return false
  }
}
