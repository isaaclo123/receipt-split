import {
  getPaymentList,
  getBalanceSumList,
  getReceiptList,
  getUser,
  getFriends,
} from "../actions/index";

import {
  Action
} from "../types/index";

import { batch } from "react-redux";

import store from "../store";
import { Dispatch } from "react";

// in seconds
const API_FETCH_INTERVAL_START = 120;
const API_FETCH_INTERVAL_MAX = 60000;
const API_FETCH_INTERVAL_INC_FACTOR = 2;

const apiFetchAll = (archive = false) => {
  console.log('apifetchall')
  const API_ACTIONS = [
    // getUser(),
    getUser(),
    getPaymentList(archive),
    getBalanceSumList(),
    getReceiptList(),
    getFriends(archive)
  ];

  const batchActions = (dispatch: Dispatch<any>) => {
    console.log("apiFetchAll running batch!")

    batch(() => {
      API_ACTIONS.forEach((action: Action<any, any>) => {
        store.dispatch(action);
      });
    });
  };


  // store.dispatch(getUser(() => {
  //   alert("afterSuccess getUser")
  //   // afterSuccess
  //   batchActions(store.dispatch);

  //   return null;
  // }));
  batchActions(store.dispatch);
}

const onApiActivity = () => {
  window.apiActivity = true;

  // if api interval was increased before
  if (window.apiInterval > API_FETCH_INTERVAL_START) {
    // reset api fetcher, run apifetchall() as well
    console.log("api Activity run API fetcher")
    startApiFetcher(true, true);
  }

  // console.log("---ON API ACTIVITY---")
  // console.log(`apiInterval ${window.apiInterval}`);
  // console.log(`apiActivity ${window.apiActivity}`);
  // console.log(`apiFetcher ${window.apiFetcher != null}`);
  // console.log("---ON API ACTIVITY---")
}

export const initApiFetcher = () => {
  if (window.apiFetcher != null) {
    clearTimeout(window.apiFetcher);
  }

  window.apiFetcher = null;
  window.apiActivity = false;
  window.apiInterval = API_FETCH_INTERVAL_START;
}

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

export const startApiFetcher = (start = false, reset = false) => {
  // reset api Activity
  window.apiActivity = true;
  // reset interval to original
  // window.apiInterval = API_FETCH_INTERVAL_START;
  if (reset) {
    initApiFetcher();
  }

  // if apiFetcher already exists
  if (window.apiFetcher != null) {
    // don't run it, let interval continue running
    // jconsole.log(`interval cleared ${window.apiFetcher}`)

    return;
    // clearTimeout(window.apiFetcher);
  } else {
    console.log(`interval not cleared`)
  }

  if (start) {
    apiFetchAll(start);
  }

  window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;
}
