import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InputArea from '../components/InputArea';
import LinkCard from '../components/LinkCard';
import Loading from '../components/Loading';
import Ripple from '../components/Ripple';
import store from '../store';
import { setAPI } from '../store/permission';
import { AccountCheck, CreateTo } from '../util/api';
import dispatcher from '../util/dispatcher';
import LogMessageOrError from '../util/log';
import './Home.css';

/**
 * @param {string} link
 * @returns {string}
 */
const PrepareLink = (link) => {
  if (typeof link !== 'string' && !(link instanceof URL)) return '';

  try {
    const straightUrl = new URL(link);
    if (straightUrl.protocol) return link;
    throw new Error('No proto');
    // eslint-disable-next-line no-empty
  } catch (e) {}

  try {
    const newUrl = new URL(`https://${link}`);
    if (newUrl.protocol) return newUrl.href;
  } catch (e) {
    return '';
  }

  return '';
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userLink, setUserLink] = useState('');
  const [linksPasted, setLinksPasted] = useState(0);
  const [createdId, setCreatedId] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  const permissionState = useSelector((state) => state.permission);

  /**
   * @param {string} [userLinkParam]
   */
  const Create = (userLinkParam) => {
    if (!store.getState().permission.api) return dispatcher.call('message', 'No permission');

    const linkToShorten = PrepareLink(userLinkParam && typeof userLinkParam === 'string' ? userLinkParam : userLink);
    if (!linkToShorten) return dispatcher.call('message', 'No link to shorten!');

    return CreateTo(linkToShorten)
      .then(({ success, id, message, to }) => {
        if (!success) return Promise.reject(message);

        dispatcher.call('message', message);
        setCreatedId(id);
        setCreatedTo(to);

        return Promise.resolve(true);
      })
      .catch(
        /** @param {import("../../types/api_error").APIError} e */ (e) => {
          if (e?.error) dispatcher.call('message', e.reason || 'Error while creating');
          else dispatcher.call('message', e?.message || e || 'Error while creating');

          LogMessageOrError(e);
        }
      );
  };

  const OnEnterHandler = () => Create();

  const Paste = () => {
    if (!store.getState().permission.clipboard) return;

    navigator.clipboard
      .readText()
      .then((readText) => {
        setUserLink(readText);
        setLinksPasted(linksPasted + 1);

        try {
          const urlToTest = new URL(readText);
          if (urlToTest.protocol && urlToTest.href) Create(urlToTest.href);
        } catch (e) {
          LogMessageOrError(e);
        }
      })
      .catch(LogMessageOrError);
  };

  /**
   * @param {KeyboardEvent} e
   */
  const OnKeyDown = (e) => {
    if (e.code === 'KeyV' && e.ctrlKey && store.getState().hotkeys.hotkeysActive) Paste();
  };

  useEffect(() => {
    AccountCheck()
      .then(({ success }) => store.dispatch(setAPI(success)))
      .catch(LogMessageOrError)
      .finally(() => setIsLoading(false));

    window.addEventListener('keydown', OnKeyDown);

    return () => window.removeEventListener('keydown', OnKeyDown);
  }, []);

  return (
    <div className="home">
      <h1 className="home__title default-title-font default-no-select">Airport Project</h1>

      {!createdId ? (
        <div className="home__card">
          <InputArea
            label="Write link"
            preset={userLink}
            setState={setUserLink}
            enterHandler={OnEnterHandler}
            key={`input-links-parted-${linksPasted}`}
            autofocus
          />

          <div className="card__actions">
            <div
              className={`card__button default-no-select ${
                permissionState.clipboard ? 'default-pointer' : 'card__button--inactive'
              }`}
              onClick={Paste}
            >
              <span>Paste</span> <i className="material-icons">paste</i>
              {permissionState.clipboard && <Ripple inheritTextColor />}
            </div>

            <div
              className={`card__button default-no-select ${userLink ? 'default-pointer' : 'card__button--inactive'}`}
              onClick={Create}
            >
              <span>Create</span> <i className="material-icons">add</i>
              {userLink && <Ripple inheritTextColor />}
            </div>
          </div>
        </div>
      ) : null}

      {createdId ? <LinkCard createdTo={createdTo} createdId={createdId} /> : null}

      {isLoading && <Loading />}
    </div>
  );
}
