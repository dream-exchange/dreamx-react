import axios from "axios";

import {
  TOKENS_FILTER,
  TOKENS_LOAD,
  TOKENS_CLEAR_FILTER
} from "../actions/types";
import config from "../config";
import singletons, { setSingleton } from "../singletons";
import {
  convertKeysToCamelCase
} from "../helpers"

export const tokensClearSearch = () => {
  return dispatch => {
    dispatch({
      type: TOKENS_CLEAR_FILTER
    });
  };
};

export const tokensHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    const regex = new RegExp(searchValue, "gmi");
    const { tokens } = getState();
    const allTokens = tokens.all;

    let filtered = [];
    for (let token of allTokens) {
      if (regex.test(token.symbol) || regex.test(token.name)) {
        filtered.push(token);
      }
    }

    dispatch({
      type: TOKENS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const tokensLoadAsync = () => {
  return async dispatch => {
    const { API_HTTP_ROOT } = config;

    let tokens = (await axios.get(`${API_HTTP_ROOT}/tokens`)).data.records;
    tokens = tokens.map(token => {
      token = convertKeysToCamelCase(token)
      token.totalBalance = token.availableBalance = token.inOrders = "0";
      return token
    })

    dispatch({
      type: TOKENS_LOAD,
      payload: { data: tokens }
    });
  };
};

export const tokensLoadAccountAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { API_HTTP_ROOT } = config;
    const balancesResponse = await axios.get(
      `${API_HTTP_ROOT}/balances/${accountAddress}`
    );
    const newBalances = balancesResponse.data.records;
    const reInitialize = true;
    dispatch(loadTokenBalances(newBalances, reInitialize));
    dispatch(initializeCableSubscriptions(accountAddress));
  };
};

const initializeCableSubscriptions = accountAddress => {
  return (dispatch, getState) => {
    const { cable } = singletons;

    const accountBalancesSubscription = cable.subscriptions.create(
      { channel: "AccountBalancesChannel", account_address: accountAddress },
      {
        connected: () => {},
        received: data => {
          dispatch(loadTokenBalances(data.payload));
        }
      }
    );

    setSingleton("AccountBalancesChannel", accountBalancesSubscription);
  };
};

const loadTokenBalances = (newBalances, reInitialize = false) => {
  return (dispatch, getState) => {
    const { tokens } = getState();
    let loadedBalances = [];
    for (let index in tokens.all) {
      const token = { ...tokens.all[index] };
      if (reInitialize) {
        token.availableBalance = "0";
        token.inOrders = "0";
        token.totalBalance = "0";
      }
      for (let balance of newBalances) {
        if (token.address === balance.token_address) {
          token.availableBalance = balance.balance;
          token.inOrders = balance.hold_balance;
          token.totalBalance = (
            parseInt(token.availableBalance) + parseInt(token.inOrders)
          ).toString();
        }
      }
      loadedBalances.push(token)
    }
    dispatch({
      type: TOKENS_LOAD,
      payload: {
        data: loadedBalances
      }
    });
  };
};
