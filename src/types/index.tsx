import { rootReducer } from "../reducers/rootReducer";

export * from "./api";
export * from "./setValue";
export * from "./consts";

export * from "./balance";
export * from "./friend";
export * from "./login";
export * from "./payment";
export * from "./reciept";
export * from "./user";

export type RootState = ReturnType<typeof rootReducer>;

export interface ButtonProps {
  variant: string;
  text: string;
  handleClick: () => void;
}

export type Failable<T, E> = {
  error: boolean;
  data: T;
  errors: E;
};

export type Action<T, P> = {
  type: T;
  payload: P;
};

export type Dict<T = any> = {
  [propName: string]: T;
};

export type SetDataReducerType = {
  successType: string;
  failType: string;
  onSuccess?: (acc: any, cur: any) => any;
  onFail?: (acc: any, cur: any) => any;
};

export type ReducerCreatorType = (
  initialState: any,
  ...args: any[]
) => (state: Failable<any, any>, action: Action<string, any>) => any;

export type DataReducerType = {
  reducerCreator: ReducerCreatorType;
  args: any[];
};
