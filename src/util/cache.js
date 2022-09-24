import dispatcher from './dispatcher';
import LogMessageOrError from './log';

/**
 * @param {boolean} showMessage
 * @returns {void}
 */
export default function ClearCache() {
  caches
    .delete(process.env.REACT_APP_CACHE_STORAGE_NAME)
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

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator)
    navigator.serviceWorker
      .register('/service-worker.js', {
        scope: '/',
      })
      .catch(LogMessageOrError);

  fetch('/build_hash')
    .then((res) => {
      if (res.status === 200) return res.text();
      return Promise.reject(new Error(`Status code ${res.status} ${res.statusText}`));
    })
    .then((versionFileContents) => {
      if (versionFileContents.trim() !== process.env.REACT_APP_BUILD_HASH) ClearCache();
    })
    .catch(LogMessageOrError);
}
