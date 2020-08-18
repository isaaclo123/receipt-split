import {
  getPaymentList,
  getBalanceSumList,
  getReceiptList,
  getUser,
  getFriends,
} from "../actions/index";

import {
  Action, Dict
} from "../types/index";

import { batch } from "react-redux";

import store from "../store";
import { Dispatch } from "react";

// in seconds
const API_FETCH_INTERVAL_START = 10;
const API_FETCH_INTERVAL_MAX = 60000;
const API_FETCH_INTERVAL_INC_FACTOR = 2;

type ApiActionDict = Dict<(a: boolean) => Array<Action<any, any>>>;

const apiFetchAll = () => {
  console.log(`--apiFetchAll--`)
  console.log(window.apiVisited)

  const API_ACTIONS: ApiActionDict = {
    "balance" : (archive: boolean) => [
      getBalanceSumList(),
      getPaymentList(archive),
    ],
    "receipts" : (archive: boolean) => [
      getReceiptList(),
    ],
    "people" : (archive: boolean) => [
      getUser(),
      getFriends(archive)
    ]
  };

  const batchActions = (dict: ApiActionDict, archive: boolean, dispatch: Dispatch<any>) => {
    for (let path in dict) {
      const funcs = dict[path];

      if (funcs == null) {
        continue;
      }

      // if visited is valid and visited in window.apiVisited, then archive
      const archive = (window.apiVisited[path] === true);

      batch(() => {
        funcs(archive).forEach((action: Action<any, any>) => {
          dispatch(action)
        });
      });
    }
  };

  batchActions(API_ACTIONS, false, store.dispatch);
}

const onApiActivity = () => {
  window.apiActivity = true;

  // if api interval was increased before
  if (window.apiInterval > API_FETCH_INTERVAL_START) {
    // reset api fetcher, run apifetchall() as well
    console.log("api Activity run API fetcher")
    initApiFetcher();
    startApiFetcher();
  }

  // console.log("---ON API ACTIVITY---")
  // console.log(`apiInterval ${window.apiInterval}`);
  // console.log(`apiActivity ${window.apiActivity}`);
  // console.log(`apiFetcher ${window.apiFetcher != null}`);
  // console.log("---ON API ACTIVITY---")
}

export const initApiFetcher = () => {
  console.log("initApiFetcher")
  if (window.apiFetcher != null) {
    clearTimeout(window.apiFetcher);
  }

  window.apiVisited = {};
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
  window.apiVisited = {};

  console.log("---INTERVAL FETCH AFTER---")
  console.log(`apiInterval ${window.apiInterval}`);
  console.log(`apiActivity ${window.apiActivity}`);
  console.log(`apiFetcher ${window.apiFetcher != null}`);
  console.log("apiVisited")
  console.log(window.apiVisited)
  console.log("---INTERVAL FETCH--- AFTER")

  window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;
}

export const startApiFetcher = (visited: string | null = null) => {
  // reset api Activity
  window.apiActivity = true;
  // window.apiVisited = {};
  // reset interval to original
  // window.apiInterval = API_FETCH_INTERVAL_START;

  if (window.apiFetcher == null) {
      console.log("apiFetcher is null")
    // if apiFetcher does not exist yet
    // fetch all without archiving
      apiFetchAll();
  } else {
    // if apiFetcher already exists
    // don't fetch, but mark for archiving
    if (visited != null) {
      window.apiVisited[visited] = true;
      console.log("apiVisited")
      console.log(window.apiVisited)
    }
    return;
  }

  window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;

  console.log(`apiFetcher ${window.apiFetcher}`)
}

// run initApiFetcher once
initApiFetcher();
