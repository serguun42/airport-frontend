import dispatcher from './dispatcher';
import LogMessageOrError from './log';
import PopupNoLogin from './popups/no-login';
import PopupNoPermission from './popups/no-permission';

const API_VERSION = 'v1';
const API_ROOT = new URL(`/api/${API_VERSION}/`, window.location.origin);

/**
 * @param {string} method
 * @param {{ [queryName: string]: string | true }} queries
 * @param {URL} [root]
 * @returns {string}
 */
const BuildURL = (method, queries, root = API_ROOT) => {
  try {
    const builtURL = new URL(method, root);

    Object.keys(queries).forEach((queryName) => {
      if (queries[queryName]) builtURL.searchParams.set(queryName, queries[queryName]);
    });

    return builtURL.href;
  } catch (e) {
    LogMessageOrError(e);
    return API_ROOT.href;
  }
};

/**
 * @param {string} method
 * @param {{ [queryName: string]: string | true }} [queries]
 * @param {RequestInit} [options]
 * @returns {Promise<import("../types").DefaultError>}
 */
export const FetchMethod = (method, queries = {}, options = {}) => {
  return fetch(BuildURL(method, queries), options).then((res) => {
    if (res.status === 401) PopupNoLogin();
    else if (res.status === 403) PopupNoPermission();
    else if (res.status === 429) dispatcher.call('message', 'Too many requests ⌛');

    try {
      return res.json().then((response) => (response?.error ? Promise.reject(response) : Promise.resolve(response)));
    } catch (e) {
      LogMessageOrError(e);
      return Promise.reject(res.status);
    }
  });
};

/**
 * @returns {Promise<{ success: boolean }>}
 */
export const AccountCheck = () => FetchMethod('account');

/**
 * @param {string} to
 * @returns {Promise<import("../../types/api_created").APICreated>}
 */
export const CreateTo = (to) => FetchMethod('create', { to });
