import { useRef, useState } from 'react';
import InputArea from '../components/InputArea';
import Ripple from '../components/Ripple';
import dispatcher from '../util/dispatcher';
import LogMessageOrError from '../util/log';
import './Auth.css';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  /** @type {import("react").MutableRefObject<HTMLInputElement>} */
  const passwordRef = useRef();

  const FocusOnPassword = () => {
    if (passwordRef.current) passwordRef.current.focus();
  };

  const SignUp = () =>
    fetch(`/api/v${process.env.REACT_APP_API_VERSION}/account/signup`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        switch (res.status) {
          case 200:
            return res.json().then((session) => setToken(session.token));

          case 429:
            return Promise.reject(new Error('Wait 10 minutes'));

          default:
            return res
              .json()
              .then((error) =>
                Promise.resolve(new Error(error.reason || `Status code ${res.status} ${res.statusText}`))
              )
              .catch(() => Promise.reject(new Error(`Status code ${res.status} ${res.statusText}`)));
        }
      })
      .then((val) => {
        if (val instanceof Error) return Promise.reject(val);
        return Promise.resolve();
      })
      .catch(
        /** @param {Error} e */ (e) => {
          LogMessageOrError(e);

          dispatcher.call('message', e?.message || e || 'Error while authenticating');
        }
      );

  const SingIn = () =>
    fetch(`/api/v${process.env.REACT_APP_API_VERSION}/account/signin`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        switch (res.status) {
          case 200:
            return res.json().then((session) => setToken(session.token));

          case 403:
            return Promise.reject(new Error(`Passwords don't match`));

          case 404:
            return SignUp();

          case 429:
            return Promise.reject(new Error('Wait 10 minutes'));

          default:
            return res
              .json()
              .then((json) => Promise.resolve(new Error(json.reason || `Status code ${res.status} ${res.statusText}`)))
              .catch(() => Promise.reject(new Error(`Status code ${res.status} ${res.statusText}`)));
        }
      })
      .then((val) => {
        if (val instanceof Error) return Promise.reject(val);
        return Promise.resolve();
      })
      .catch(
        /** @param {Error} e */ (e) => {
          LogMessageOrError(e);

          dispatcher.call('message', e?.message || e || 'Error while authenticating');
        }
      );

  const RedirectWithToken = () => {
    if (!token) return Promise.reject(new Error('No token was passed for redirect'));

    window.location.assign(`/auth/success?token=${token}`);
    return Promise.resolve();
  };

  return (
    <div className="auth-page">
      <h1 className="auth__title default-title-font default-no-select">Login</h1>
      <div className="auth__card">
        {!token ? (
          <>
            <InputArea
              label="username"
              setState={setUsername}
              enterHandler={FocusOnPassword}
              placeholder="Username"
              autofocus
              key="auth-username"
            />
            <InputArea
              label="password"
              type="password"
              setState={setPassword}
              enterHandler={SingIn}
              placeholder="Password"
              key="auth-password"
              passedRef={passwordRef}
            />
            <div className="auth__button-container">
              <button
                type="button"
                className={`auth__button ${
                  !!username && !!password ? 'auth__button--active default-pointer' : 'auth__button--inactive disabled'
                } default-no-select`}
                onClick={SingIn}
              >
                <div className="auth__button__text">Sign in or register</div>
                <div className="material-icons">login</div>
                {!!username && !!password && <Ripple inheritTextColor />}
              </button>
            </div>
          </>
        ) : (
          <>
            <h4 className="auth__subtitle default-title-font default-no-select">Grant access to Airport app?</h4>
            <button
              type="button"
              className="auth__button auth__button--active default-pointer default-no-select"
              onClick={RedirectWithToken}
            >
              <div className="auth__button__text">Proceed</div>
              <div className="material-icons">done</div>
              <Ripple inheritTextColor />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
