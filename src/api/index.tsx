import { LoginPayload, SignupPayload, RecieptType } from "../types/index";
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

// reciept

export const fetchRecieptList = (token: string) =>
  fetchData("reciept", "GET", null, token);

export const saveRecieptById = (
  token: string,
  id: number,
  payload: RecieptType
) => fetchData(`reciept/${id}`, "PUT", payload, token);

export const fetchRecieptById = (
  token: string,
  id: number,
  payload: RecieptType
) => fetchData(`reciept/${id}`, "GET", null, token);

// user

export const fetchUser = (token: string) =>
  fetchData("user", "GET", null, token);

export const fetchFriends = (token: string) =>
  fetchData("friends", "GET", null, token);

export const addUser = (token: string, username: string) =>
  fetchData(`friend/${username}`, "POST", null, token);
