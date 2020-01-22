import {
  RecieptState,
  RecieptIdAction,
  RECIEPT_ID_SUCCESS,
  RECIEPT_ID_FAIL,
  Failable,
  Action,
  RECIEPT_SET_NAME,
  RECIEPT_SET_AMOUNT,
  RECIEPT_SET_DATE
} from "../types/index";

import { setDataReducer, editDataReducer, applyDataReducers } from "./index";

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
  switch (action.type) {
    case RECIEPT_SET_NAME:
      console.log("RECIEPT_SET_NAME");
      const name = action.payload;
      console.log(name);

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

export const recieptReducer = applyDataReducers<RecieptState, RecieptIdAction>(
  initialState,
  [
    {
      reducerCreator: setDataReducer,
      args: [
        {
          successType: RECIEPT_ID_SUCCESS,
          failType: RECIEPT_ID_FAIL
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECIEPT_SET_NAME,
          field: "name"
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECIEPT_SET_AMOUNT,
          field: "amount"
        }
      ]
    },
    {
      reducerCreator: editDataReducer,
      args: [
        {
          successType: RECIEPT_SET_DATE,
          field: "date"
        }
      ]
    }
  ]
);
