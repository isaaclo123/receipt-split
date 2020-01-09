import { RootState } from "../types/index";

export * from "./getReciept";
// export * from "./getUser";
// export * from "./saveReciept";
export * from "./setLogin";
// export * from "./setReciept";
// export * from "./setSignup";
//
export const getToken = (getState: () => RootState) => {
  return getState().loginState.data.token;
};
