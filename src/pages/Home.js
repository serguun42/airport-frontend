import { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import dispatcher from '../util/dispatcher';
import LogMessageOrError from '../util/log';
import './Home.css';

const APP_MIME_TYPE = 'application/vnd.android.package-archive';
const APP_FILE_TYPE = '.apk';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const DownloadApp = () => {
    dispatcher.call('message', 'Downloading…');
    setIsLoading(true);

    fetch(process.env.REACT_APP_ANDROID_APP_URL)
      .then((res) => res.blob())
      .then((blob) => {
        const properBlob = blob.slice(0, blob.size, APP_MIME_TYPE);
        const blobUrl = URL.createObjectURL(properBlob);

        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', blobUrl);
        downloadLink.setAttribute('download', `${process.env.REACT_APP_ANDROID_APP_NAME}${APP_FILE_TYPE}`);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
      })
      .catch((e) => {
        LogMessageOrError(e);
        dispatcher.call('message', 'Error while downloading');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="home">
      <h1 className="home__title default-title-font default-no-select">Airport Project</h1>

      <div className="home__card default-pointer" onClick={DownloadApp}>
        <i className="material-icons">android</i>
        Download Android app
      </div>

      <div className="home__options">
        <Link className="home__card home__card--option" to="/docs/api/swagger">
          <i className="material-icons">api</i>
          <span>Swagger API</span>
        </Link>
        <a
          className="home__card home__card--option"
          href="/docs/api/redoc.html"
          target="_self"
          rel="noopener noreferrer"
          to="/docs/api/redoc.html"
        >
          <i className="material-icons">api</i>
          <span>Redoc</span>
        </a>
      </div>

      <h3 className="home__title default-title-font default-no-select">Source code</h3>

      <div className="home__options">
        <a
          className="home__card home__card--option"
          href="https://github.com/serguun42/airport-enhanced"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="octicon default-no-select"
            height="32"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              // eslint-disable-next-line max-len
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          <span>Android app code repo</span>
        </a>
        <a
          className="home__card home__card--option"
          href="https://github.com/serguun42/airport-frontend"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="octicon default-no-select"
            height="32"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              // eslint-disable-next-line max-len
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          <span>This frontend code repo</span>
        </a>
      </div>

      <div className="home__options">
        <div className="home__card home__card--option">
          <i>Coming soon: backend code repo</i>
        </div>
      </div>

      {isLoading && <Loading />}
    </div>
  );
}
