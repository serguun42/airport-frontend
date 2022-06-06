import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import './Home.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const DownloadApp = () => {
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', process.env.REACT_APP_ANDROID_APP_URL);
    downloadLink.setAttribute('download', `${process.env.REACT_APP_ANDROID_APP_NAME}.apk`);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
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
