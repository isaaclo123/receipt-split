import {
  getPaymentListAndBalances,
  getReceiptList,
  getUserAndFriends,
} from "../actions/index";

import {
  Action
} from "../types/index";

import store from "../store";

// in seconds
export const API_FETCH_INTERVAL = 300;

export const startApiFetcher = () => {
  const API_ACTIONS = [
    getPaymentListAndBalances(false),
    getReceiptList(),
    getUserAndFriends(false)
  ];

  console.log("start api");

  if (window.apiFetcher != null) {
    console.log(`interval cleared ${window.apiFetcher}`)

    clearInterval(window.apiFetcher);
  } else {
    console.log(`interval not cleared`)
  }

  window.apiFetcher = setInterval(() => {
    console.log("interval fetch")

    API_ACTIONS.forEach((action: Action<any, any>) => {
      store.dispatch(action)
    });

  }, API_FETCH_INTERVAL * 1000) as any;
}
