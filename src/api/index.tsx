import { LoginPayload, SignupPayload, ReceiptType, PaymentType } from "../types/index";
import { fetchData } from "./helpers";

export const SERVER_URL = `http://localhost:5000`;

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

export const fetchAddFriend = (username: string, token: string) =>
  fetchData(`friend/${username}`, "POST", null, token);

// balance_sum

export const fetchBalanceSumList = (token: string) =>
  fetchData(`balancesums`, "GET", null, token);

// payment
export const savePayment = (payload: PaymentType, token: string) =>
  fetchData("pay", "POST", payload);
