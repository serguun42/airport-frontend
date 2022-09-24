import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import store from '../store';
import dispatcher from '../util/dispatcher';
import { nextTheme } from '../store/theme';
import './Footer.css';

export default function Footer() {
  const footerLinks = [
    { icon: 'home', href: '/', text: 'Home page', router: true },
    { icon: 'contact_mail', href: 'https://serguun42.ru/?contacts', text: 'Contacts' },
    { icon: 'dashboard', href: 'https://serguun42.ru/guide', text: 'All services' },
    { icon: 'code', href: 'https://serguun42.ru/about', text: 'Development – @serguun42' },
  ];

  const changeTheme = () => store.dispatch(nextTheme());
  const clearCache = () => dispatcher.call('clearCache');

  const themeState = useSelector((state) => state.theme);

  return (
    <footer className="footer">
      <section className="footer__section footer__section--logo">
        <img
          className="footer__logo-img"
          src={`${process.env.PUBLIC_URL}/img/icons/round/256x256.png`}
          draggable="false"
          onContextMenu={() => false}
          alt="Airport Project"
        />
        <div className="footer__logo-desc">
          <div className="footer__logo-desc__title default-title-font">Airport Project</div>
          <div>
            <i className="material-icons">copyright</i>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </section>

      <section className="footer__section">
        {footerLinks.map((link) =>
          link.router ? (
            <Link className="footer__section__item" to={link.href} key={link.href}>
              <i className="material-icons">{link.icon}</i>
              <span>{link.text}</span>
            </Link>
          ) : (
            <a
              className="footer__section__item"
              target="_blank"
              rel="noopener noreferrer"
              href={link.href}
              key={link.href}
            >
              <i className="material-icons">{link.icon}</i>
              <span>{link.text}</span>
            </a>
          )
        )}
      </section>

      <section className="footer__section">
        <div className="footer__section__item default-no-select default-pointer" onClick={() => changeTheme()}>
          <i className="material-icons">{themeState.icon}</i>
          <span>{themeState.name}</span>
        </div>

        <div className="footer__section__item default-no-select default-pointer" onClick={() => clearCache()}>
          <i className="material-icons">delete_outline</i>
          <span>Clear cache</span>
        </div>
      </section>
    </footer>
  );
}
