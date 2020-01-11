import { SERVER_URL, DEFAULT_HEADERS } from "./index";

export const fetchData = async (
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

  const response = await fetch(`${SERVER_URL}/${url}`, options);

  console.log(response);
  const json = await response.json();

  if (!response.ok) {
    return Promise.reject(new Error("JSON ERROR"));
  }

  return json;
};
