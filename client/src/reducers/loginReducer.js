const initialState = false

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOGIN':
      return true
    default:
      return false
  }
}
