import {
  getPaymentList,
  getBalanceSumList,
  getReceiptList,
  getUser,
  getFriends,
} from "../actions/index";

import {
  Action, Dict, BALANCE_PAGE, RECEIPT_PAGE, PEOPLE_PAGE
} from "../types/index";

import { batch } from "react-redux";

import store from "../store";
import { Dispatch } from "react";
import { getToken } from "./token";

// in seconds
const API_FETCH_INTERVAL_START = 30;
const API_FETCH_INTERVAL_MAX = 60000;
const API_FETCH_INTERVAL_INC_FACTOR = 2;

const API_ACTIONS: ApiActionDict = {
  [BALANCE_PAGE] : (archive: boolean) => [
    getBalanceSumList(),
    getPaymentList(archive),
  ],
  [RECEIPT_PAGE] : (archive: boolean) => [
    getReceiptList(),
  ],
  [PEOPLE_PAGE] : (archive: boolean) => [
    getUser(),
    getFriends(archive)
  ]
};

type ApiActionDict = Dict<(a: boolean) => Array<Action<any, any>>>;

const apiFetchAll = () => {
  console.log(`--apiFetchAll--`)
  console.log(window.apiVisited)

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
  // reset apiVisited
  window.apiVisited = {};

  console.log("---INTERVAL FETCH AFTER---")
  console.log(`apiInterval ${window.apiInterval}`);
  console.log(`apiActivity ${window.apiActivity}`);
  console.log(`apiFetcher ${window.apiFetcher != null}`);
  console.log("apiVisited")
  console.log(window.apiVisited)
  console.log("---INTERVAL FETCH--- AFTER")

  // create api fetcher again
  window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;
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

export const startApiFetcher = () => {
  // if not authenticated, don't start
  const token = getToken();
  if (token == null) {
    return;
  }

  // reset api Activity
  window.apiActivity = true;
  // window.apiVisited = {};
  // reset interval to original
  // window.apiInterval = API_FETCH_INTERVAL_START;

  if (window.apiFetcher == null) {
    // run apiFetchAll if this is first run

    // fetch all without archiving
    apiFetchAll();
    window.apiFetcher = setTimeout(runInTimeout, window.apiInterval * 1000) as any;
  }
}


export const apiArchive = (visited: string) => {
  window.apiVisited[visited] = true;
}

/* -- run initApiFetcher once at start -- */
initApiFetcher();
