import dispatcher from './dispatcher';
import LogMessageOrError from './log';

const CACHE_STORAGE_NAME = 'airport_react_cache_storage';

/**
 * @param {boolean} showMessage
 * @returns {void}
 */
export default function ClearCache() {
  caches
    .delete(CACHE_STORAGE_NAME)
    .then(() => {
      dispatcher.call('message', 'Cache has been cleared');
    })
    .catch((e) => {
      LogMessageOrError(e);

      dispatcher.call('message', 'Error while clearing cache');
    });

  if ('serviceWorker' in navigator)
    navigator.serviceWorker.getRegistrations().then((registered) => registered.forEach((sw) => sw.unregister()));
}

dispatcher.link('clearCache', ClearCache);

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production')
  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/',
  });

window.addEventListener('load', () => {
  if (process.env.NODE_ENV !== 'production') return;

  fetch('/build_hash')
    .then((res) => {
      if (res.status === 200) return res.text();
      return Promise.reject(new Error(`Status code ${res.status} ${res.statusText}`));
    })
    .then((versionFileContents) => {
      if (versionFileContents.trim() !== process.env.REACT_APP_BUILD_HASH) ClearCache();
    })
    .catch(LogMessageOrError);
});
