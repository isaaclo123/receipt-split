import {
  Dict,
  ReducerCreatorType,
  Action,
  Failable,
  SetDataReducerType,
  DataReducerType
} from "../types/index";

export const setDataReducer = (
  initialState: any,
  {
    successType,
    failType,
    onSuccess = (a: Dict, b: any) => b,
    onFail = (a: Dict, b: any) => b
  }: SetDataReducerType
) => (state: Failable<any, any>, action: Action<string, any>) => {
  switch (action.type) {
    case successType:
      return {
        error: false,
        data: onSuccess(state.data, action.payload),
        errors: initialState.errors
      };
    case failType:
      return Object.assign({}, state, {
        error: true,
        errors: onFail(state.errors, action.payload)
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
  // console.log("BEFORE STATE");
  // console.log(state);
  // console.log("END BEFORE STATE");

  const myresult = reducers.reduce((accState, { reducerCreator, args }) => {
    const result = reducerCreator(initialState, ...args)(accState, action);
    // console.log("MID STATE");
    // console.log(result);
    // console.log("MID STATE");
    return result;
  }, state);
  // console.log("AFTER STATE");
  // console.log(myresult);
  // console.log("AFTER STATE");
  return myresult;
};

export const insertIndex = <T extends {}>(
  state: T[],
  newItem: T,
  insertAt: number
) => {
  return [...state.slice(0, insertAt), newItem, ...state.slice(insertAt + 1)];
};

export const removeIndex = <T extends {}>(state: T[], deleteAt: number) => {
  return [...state.slice(0, deleteAt), ...state.slice(deleteAt + 1)];
};
