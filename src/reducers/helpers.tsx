import { Action, Failable, SetDataReducerType } from "../types/index";

export const setDataReducer = ({
  successType,
  failType,
  initialState
}: SetDataReducerType) => (
  state: Failable<any, any> = initialState,
  action: Action<string, any>
) => {
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
