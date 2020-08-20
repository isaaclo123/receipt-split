import { TOKEN_LOCALSTORAGE } from "../types/index";

export const removeToken = () => {
  localStorage.removeItem(TOKEN_LOCALSTORAGE);
}

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_LOCALSTORAGE);

  if (token === "" || token == null) {
    return null;
  }

  return token;
}

export const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_LOCALSTORAGE, token)
}
