import { Dispatch } from 'redux';

import { SignupData, SignupAction } from '../types/index'

export const setSignup = (payload: SignupData) => (dispatch: Dispatch) => {
  console.log(payload)
  const signupAction: SignupAction = {
    type: 'SIGNUP_REQUEST',
    payload
  }

  dispatch(signupAction)
}
