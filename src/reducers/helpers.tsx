import {
  Dict,
  Action,
  Failable,
  SetDataReducerType,
  EditDataReducerType,
  DataReducerType,
  EDIT_DATA_PREPEND,
  EDIT_DATA_APPEND
} from "../types/index";

export const getCurrentDate = () => {
  const today = new Date()

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  const date = `${yyyy}-${mm}-${dd}`;
  return date;
}

export const initState = (data: any) => {
  return {
    modified: false,
    error: false,
    data,
    errors: {}
  }
}

export const setDataReducer = (
  initialState: any,
  {
    modified = true,
    successType,
    failType,
    onSuccess = (data: Dict, payload: any) => payload,
    onFail = (data: Dict, payload: any) => payload
  }: SetDataReducerType
) => (state: Failable<any, any>, action: Action<string, any>) => {
  switch (action.type) {
    case successType:
      return {
      modified: modified,
        error: false,
        data: onSuccess(state.data, action.payload), // TODO assign maybe
        errors: {}
      };
    case failType:
      return Object.assign({}, state, {
        modified: state.modified,
        error: true,
        errors: onFail(state.errors, action.payload)
      });
    default:
      return state;
  }
};

export const editDataReducer = (
  initialState: any,
  { modified = true, successType, field, isDelete = false }: EditDataReducerType
) => (state: Failable<any, any>, action: Action<string, any>) => {
  const assign = (
    payload: any,
    state: any,
    field: [string, boolean][],
    ids: number[]
  ): any => {
    if (field.length === 0) {
      return payload;
    }

    const [cur, ...rest] = field;
    const [key, hasIndex] = cur;

    // console.log("rest, key, hasIndex START");
    // console.log("rest");
    // console.log(rest);
    // console.log("key");
    // console.log(key);
    // console.log("hasIndex");
    // console.log(hasIndex);
    // console.log("state");
    // console.log(state);
    // console.log("rest, key, hasIndex END");

    if (hasIndex === false) {
      return Object.assign({}, state, {
        [key]: assign(payload, state[key], rest, ids)
      });
    }

    const [id, ...restIds] = ids;

    // hasIndex is true

    if (isDelete && !rest.length) {
      return Object.assign({}, state, {
        [key]: [...state[key].slice(0, id), ...state[key].slice(id + 1)]
      });
    }

    if (id === EDIT_DATA_PREPEND) {
      // console.log("EDITDATAPREPEND");
      // console.log(state);
      // console.log(key);
      // console.log(state[key]);
      // console.log("EDITDATAPREPEND");

      return Object.assign({}, state, {
        [key]: [payload, ...state[key]]
      });
    }

    if (id === EDIT_DATA_APPEND) {
      return Object.assign({}, state, {
        [key]: [...state[key], payload]
      });
    }

    // with ID
    return Object.assign({}, state, {
      [key]: [
        ...state[key].slice(0, id),
        assign(payload, state[key][id], rest, restIds),
        ...state[key].slice(id + 1)
      ]
    });
  };

  switch (action.type) {
    case successType:
      const { ids, data } = action.payload;
      return {
        modified: modified,
        error: state.data.error,
        data: assign(data, state.data, field, ids),
        errors: state.errors
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
  const myresult = reducers.reduce((accState, { reducerCreator, args }) => {
    const result = reducerCreator(initialState, ...args)(accState, action);
    return result;
  }, state);
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

export const createDeleteReducers = (map: Dict<string>): DataReducerType[] =>
  Object.entries(map).map(([field, type]: [string, string]) => {
    return {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: type,
          field: [[field, true]],
          isDelete: true
        }
      ]
    }
  })
