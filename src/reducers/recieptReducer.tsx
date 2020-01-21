import {
  RecieptState,
  RecieptAction,
  RecieptIdAction,
  RecieptSetNameAction,
  RECIEPT_ID_SUCCESS,
  RECIEPT_SET_NAME,
  RECIEPT_ID_FAIL,
  Failable,
  Action
} from "../types/index";

import { setDataReducer, applyDataReducers } from "./index";

const initialState: RecieptState = {
  error: false,
  data: {
    id: -1,
    name: "",
    amount: 0,
    date: "",
    resolved: false,
    user: {
      id: -1,
      fullname: "",
      username: ""
    },
    users: [],
    balances: [],
    reciept_items: []
  },
  errors: {}
};

export const recieptEditReducer = (initialState: any) => (
  state: Failable<any, any>,
  action: Action<string, any>
) => {
  return state;
  switch (action.type) {
    case RECIEPT_SET_NAME:
      console.log("RECIEPT_SET_NAME");
      const name = action.payload;

      return {
        error: false,
        data: Object.assign({}, state.data, {
          name
        }),
        errors: {}
      };
    default:
      return state;
  }
};

export const recieptReducer = applyDataReducers<RecieptState, RecieptAction>(
  initialState,
  [
    {
      reducerCreator: recieptEditReducer,
      args: []
    },
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: RECIEPT_ID_SUCCESS,
          failType: RECIEPT_ID_FAIL
        }
      ]
    }
  ]
);
