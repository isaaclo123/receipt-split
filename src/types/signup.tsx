export interface SignupData {
  username: string;
  fullname: string;
  password: string;
}

export interface SignupState extends SignupData {
  signed_up: boolean;
}

export interface SignupAction {
  type: string;
  payload: SignupData | null;
}
