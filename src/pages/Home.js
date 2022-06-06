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

      <div className="home__api">
        <Link to="/docs/api/swagger" className="home__api-option">
          <i className="material-icons">api</i>
          <span>Swagger API</span>
        </Link>
        <a
          href="/docs/api/redoc.html"
          target="_self"
          rel="noopener noreferrer"
          to="/docs/api/redoc.html"
          className="home__api-option"
        >
          <i className="material-icons">api</i>
          <span>Redoc</span>
        </a>
      </div>

      <div className="home__card default-pointer" onClick={DownloadApp}>
        <i className="material-icons">android</i>
        Download Android App
      </div>

      {isLoading && <Loading />}
    </div>
  );
}
