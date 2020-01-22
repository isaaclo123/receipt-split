import {
  Dict,
  ReducerCreatorType,
  Action,
  Failable,
  SetDataReducerType,
  EditDataReducerType,
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

export const editDataReducer = (
  initialState: any,
  { successType, field }: EditDataReducerType
) => (state: Failable<any, any>, action: Action<string, any>) => {
  const assign = (
    payload: any,
    state: any,
    field: [string, number | null][]
  ): any => {
    if (field.length === 0) {
      return payload;
    }

    const [cur, ...rest] = field;
    const [key, index] = cur;

    const newItem = assign(payload, state[key], rest);

    if (index == null) {
      return Object.assign({}, state, {
        [key]: newItem
      });
    }

    return Object.assign({}, state, {
      [key]: [
        ...state[key].slice(0, index),
        newItem,
        ...state[key].slice(index + 1)
      ]
    });
  };

  switch (action.type) {
    case successType:
      return {
        error: state.data.error,
        data: assign(action.payload, state.data, field),
        errors: state.data.errors
      };
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
