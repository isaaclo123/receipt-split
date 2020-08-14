import { LoginPayload, SignupPayload, ReceiptType, PaymentEditType } from "../types/index";
import { fetchData } from "./helpers";

// every 5 min
// export const API_FETCH_INTERVAL = 300000;

// API_FETCH_INTERVAL in seconds
export const API_FETCH_INTERVAL = 300;

export const SERVER_URL = (process.env.NODE_ENV !== 'production') ?
  (
    (process.env.REACT_APP_API_URL_DEVELOPMENT != null) ?
      process.env.REACT_APP_API_URL_DEVELOPMENT :
      'http://localhost:5000'
  ) :
  process.env.REACT_APP_API_URL_PRODUCTION;

export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

// login

export const fetchLogin = (payload: LoginPayload) =>
  fetchData("auth", "POST", payload);

export const fetchSignup = (payload: SignupPayload) =>
  fetchData("signup", "POST", payload);

// receipt

export const fetchReceiptList = (token: string) =>
  fetchData("receipt", "GET", null, token);

export const saveReceiptById = (
  id: number,
  payload: ReceiptType,
  token: string
) => fetchData(`receipt/${id}`, "PUT", payload, token);

export const fetchReceiptById = (
  id: number,
  // payload: ReceiptType,
  token: string
) => fetchData(`receipt/${id}`, "GET", null, token);

export const deleteReceiptById = (
  id: number,
  // payload: ReceiptType,
  token: string
) => fetchData(`receipt/${id}`, "DELETE", null, token);

// user

export const fetchUser = (token: string) =>
  fetchData("user", "GET", null, token);

export const fetchFriends = (token: string) =>
  fetchData("friends", "GET", null, token);

export const fetchFriendsArchive = (token: string) =>
  fetchData("friends", "PUT", null, token);

export const fetchAddFriend = (username: string, token: string) =>
  fetchData(`friend/${username}`, "POST", null, token);

export const confirmFriend = (id: number, action: "accept" | "reject", token: string) =>
  fetchData(`friends/${id}/${action}`, "POST", null, token);

// balance_sum

export const fetchBalanceSumList = (token: string) =>
  fetchData(`balancesums`, "GET", null, token);

// payment
export const savePayment = (payload: PaymentEditType, token: string) =>
  fetchData(`payment`, "POST", payload, token);

export const fetchPaymentList = (token: string) =>
  fetchData(`payments`, "GET", null, token);

export const fetchPaymentListArchive = (token: string) =>
  fetchData(`payments`, "PUT", null, token);

export const confirmPayment = (id: number, action: "accept" | "reject", token: string) =>
  fetchData(`payments/${id}/${action}`, "POST", null, token);
