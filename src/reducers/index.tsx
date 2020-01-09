export * from "./loginReducer";
// export * from "./recieptReducer";
export * from "./recieptListReducer";
export * from "./userReducer";

export * from "./rootReducer";

// export const getReducer

// import { RecieptListState, RecieptListAction } from "../types/index";
//
// const initialState: RecieptListState = {
//   error: false,
//   data: [],
//   errors: []
// };
//
// export const getReducer = (
//   state: RecieptListState = initialState,
//   action: RecieptListAction
// ) => {
//   switch (action.type) {
//     case "RECIEPT_LIST_SUCCESS":
//       return {
//         error: false,
//         data: action.payload,
//         errors: []
//       };
//     case "RECIEPT_LIST_FAIL":
//       return Object.assign({}, state, {
//         error: true,
//         errors: action.payload //TODO
//       });
//     default:
//       return state;
//   }
// };
