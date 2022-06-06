/* eslint-disable no-empty */
/**
 * @param {string} urlLike
 * @returns {URL}
 */
export default function SafeURL(urlLike) {
  if (!urlLike || typeof urlLike !== 'string') return new URL(`https://airport.serguun42.ru`);

  try {
    const url = new URL(urlLike);
    url.pathname = url.pathname.replace(/\/+/g, '/');
    return url;
  } catch (e) {}

  try {
    const url = new URL(urlLike, `https://airport.serguun42.ru`);
    url.pathname = url.pathname.replace(/\/+/g, '/');
    return url;
  } catch (e) {}

  return new URL(`https://airport.serguun42.ru`);
}
