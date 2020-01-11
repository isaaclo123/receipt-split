import {
  ReducerCreatorType,
  Action,
  Failable,
  SetDataReducerType,
  DataReducerType
} from "../types/index";

export const setDataReducer = (
  initialState: any,
  { successType, failType }: SetDataReducerType
) => (state: Failable<any, any>, action: Action<string, any>) => {
  switch (action.type) {
    case successType:
      return {
        error: false,
        data: action.payload,
        errors: initialState.errors
      };
    case failType:
      return Object.assign({}, state, {
        error: true,
        errors: action.payload //TODO
      });
    default:
      return state;
  }
};

export const applyDataReducers = <
  S extends Failable<any, any>,
  A extends Action<string, any>
>(
  initialState: S,
  reducers: DataReducerType[]
) => (state: S = initialState, action: A) => {
  return reducers.reduce(
    (accState, { reducerCreator, args }) =>
      reducerCreator(initialState, ...args)(state, action),
    initialState
  );
};
