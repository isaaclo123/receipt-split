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
export const API_FETCH_INTERVAL_START = 120;
export const API_FETCH_INTERVAL_MAX = 60000;
export const API_FETCH_INTERVAL_INC_FACTOR = 2;

const apiFetchAll = () => {
  console.log("apiFetchAll running!")
  const API_ACTIONS = [
    getPaymentListAndBalances(false),
    getReceiptList(),
    getUserAndFriends(false)
  ];

  API_ACTIONS.forEach((action: Action<any, any>) => {
    store.dispatch(action);
  });
}

const onApiActivity = () => {
  window.apiActivity = true;

  // if api interval was increased before
  if (window.apiInterval > API_FETCH_INTERVAL_START) {
    // reset api fetcher, run apifetchall() as well
    startApiFetcher(true);
  }

  console.log("---ON API ACTIVITY---")
  console.log(`apiInterval ${window.apiInterval}`);
  console.log(`apiActivity ${window.apiActivity}`);
  console.log(`apiFetcher ${window.apiFetcher != null}`);
  console.log("---ON API ACTIVITY---")
}

window.apiFetcher = null;
window.apiActivity = false;
window.apiInterval = API_FETCH_INTERVAL_START;

// window.addEventListener('load', () => {startApiFetcher(true)}, true);

const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

events.forEach((name) => {
  document.addEventListener(name, onApiActivity, true);
});

const runInTimeout = () => {
  console.log("---INTERVAL BEFORE---")
  console.log(`apiInterval ${window.apiInterval}`);
  console.log(`apiActivity ${window.apiActivity}`);
  console.log(`apiFetcher ${window.apiFetcher != null}`);
  console.log("---INTERVAL BEFORE---")

  apiFetchAll();

  // if no movement occoured
  if (!window.apiActivity) {
    // double interval between polling, up to max
    window.apiInterval *= API_FETCH_INTERVAL_INC_FACTOR;
    if (window.apiInterval > API_FETCH_INTERVAL_MAX) {
      window.apiInterval = API_FETCH_INTERVAL_MAX;
    }
  } else {
    // if movement occoured, reset apiInterval
    window.apiInterval = API_FETCH_INTERVAL_START;
  }

  // reset apiActivity
  window.apiActivity = false;

  console.log("---INTERVAL FETCH AFTER---")
  console.log(`apiInterval ${window.apiInterval}`);
  console.log(`apiActivity ${window.apiActivity}`);
  console.log(`apiFetcher ${window.apiFetcher != null}`);
  console.log("---INTERVAL FETCH--- AFTER")

  window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;
}

export const startApiFetcher = (start = false) => {
  console.log("start api");

  // reset api Activity
  window.apiActivity = false;
  // reset interval to original
  window.apiInterval = API_FETCH_INTERVAL_START;

  // if apiFetcher already exists
  if (window.apiFetcher != null) {
    // clear it
    console.log(`interval cleared ${window.apiFetcher}`)

    clearTimeout(window.apiFetcher);
  } else {
    console.log(`interval not cleared`)
  }

  if (start) {
    apiFetchAll();
  }

  window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;
}
