export interface SignupPayload {
  username: string;
  fullname: string;
  password: string;
}

// export interface SignupState extends SignupData {
//   signed_up: boolean;
// }

export interface SignupAction {
  type: string;
  payload: SignupPayload;
}
