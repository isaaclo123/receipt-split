import { TOKEN_LOCALSTORAGE } from "../types/index";

// const jwt = require('jsonwebtoken');

export const removeToken = () => {
  localStorage.removeItem(TOKEN_LOCALSTORAGE);
}

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_LOCALSTORAGE);

  if (token === "" || token == null) {
    return null;
  }

  return token;

  // try {
  //   jwt.verify(token, 'wrong-secret');
  //   return token;
  // } catch(err) {
  //   removeToken();
  //   return null
  // }
}

export const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_LOCALSTORAGE, token)
}
