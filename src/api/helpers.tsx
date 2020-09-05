import { SERVER_URL, DEFAULT_HEADERS } from "./index";
import { ApiFetchType } from "../types/index";
import { initApiFetcher } from "./apiFetcher";
import { removeToken } from "./token";

// TODO: make type safe
export const fetchData = async (
  url: string,
  method: string,
  payload: any,
  token = ""
): Promise<ApiFetchType> => {
  try {
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

    console.log("--OPTIONS START--")
    console.log(options)
    console.log("--OPTIONS END--")

    const response = await fetch(`${SERVER_URL}/${url}`, options);

    console.log("RESPONSE START");
    console.log(response)
    console.log(response.body)
    console.log("RESPONSE END");

    const json = await response.json();

    if (!response.ok) {

      // logout on response error
      if (response.status === 401) { // unauthorized
        initApiFetcher();
        removeToken();
      }

      return {
        modified: true,
        error: true,
        data: {},
        errors: json
      };
    }

    return {
      modified: false,
      error: false,
      data: json,
      errors: {}
    };
  } catch (e) {
    console.log("----ERROR START----")
    console.log(e)
    console.log("----ERROR END----")
    return {
      modified: true,
      error: true,
      data: {},
      errors: { error: e.message }
    };
  }
};
