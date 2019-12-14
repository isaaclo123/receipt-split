import {
  LoginData,
  SignupData,
  RecieptData
} from '../types/index'

const SERVER_URL = `http://127.0.0.1:5000`

export const fetchLogin = async (myloginData: any) => {
  try {
    const loginData: LoginData = myloginData
    const response = await fetch(`${SERVER_URL}/auth`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })

    const json = await response.json()
    return json
  } catch (e) {
    return null
  }
}

export const fetchSignup = async (mySignupData: any) => {
  try {
    const signupData: SignupData = mySignupData
    const response = await fetch(`${SERVER_URL}/signup`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signupData)
    })

    const json = await response.json()
    return json
  } catch (e) {
    return null
  }
}


export const fetchRecieptList = async (token: any) => {
  try {
    const response = await fetch(`${SERVER_URL}/reciept`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      }
    })

    const json = await response.json()
    return json
  } catch (e) {
    return null
  }
}


export const fetchRecieptById = async (token: any, id: number) => {
  try {
    const response = await fetch(`${SERVER_URL}/reciept/${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      }
    })

    const json = await response.json()
    return json
  } catch (e) {
    return null
  }
}
