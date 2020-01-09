import { LoginPayload, SignupPayload, RecieptType } from "../types/index";

const SERVER_URL = `http://localhost:5000`;

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const fetchData = async (
  url: string,
  method: string,
  payload: any,
  token = ""
) => {
  const headers = !token
    ? DEFAULT_HEADERS
    : Object.assign({}, DEFAULT_HEADERS, {
        Authorization: `JWT ${token}`
      });

  const defaultOpts: RequestInit = {
    method,
    headers,
    mode: "cors"
  };

  const options = !payload
    ? defaultOpts
    : Object.assign({}, defaultOpts, { body: JSON.stringify(payload) });

  console.log(options);

  const response = await fetch(`${SERVER_URL}/${url}`, options);

  const json = await response.json();

  if (!response.ok) {
    await Promise.reject(new Error(json));
  }

  return json;
};

/* start of API calls */

// login

export const fetchLogin = async (payload: LoginPayload) =>
  fetchData("auth", "POST", payload);

export const fetchSignup = async (payload: SignupPayload) =>
  fetchData("signup", "POST", payload);

// reciept

export const fetchRecieptList = async (token: string) =>
  fetchData("reciept", "GET", null, token);

export const saveRecieptById = async (
  token: string,
  id: number,
  payload: RecieptType
) => fetchData(`reciept/${id}`, "PUT", payload, token);

export const fetchRecieptById = async (
  token: string,
  id: number,
  payload: RecieptType
) => fetchData(`reciept/${id}`, "GET", null, token);

// user

export const fetchUser = (token: string) =>
  fetchData("user", "GET", null, token);

export const addUser = async (token: any, username: string) =>
  fetchData(`friend/${username}`, "POST", null, token);
