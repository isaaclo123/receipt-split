import {
  UserAction,
  UserState,
  USER_INFO_SUCCESS,
  USER_INFO_FAIL
} from "../types/index";

const initialState: UserState = {
  error: false,
  data: {
    id: -1,
    username: "",
    fullname: ""
  },
  errors: {}
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  switch (action.type) {
    case USER_INFO_SUCCESS:
      return {
        error: false,
        data: action.payload,
        errors: {}
      };
    case USER_INFO_FAIL:
      return Object.assign({}, state, {
        error: true,
        errors: action.payload
      });
    default:
      return state;
  }
};
