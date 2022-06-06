import PropTypes from 'prop-types';
import { useState } from 'react';
import QRCode from 'qrcode';
import dispatcher from '../util/dispatcher';
import LogMessageOrError from '../util/log';
import Ripple from './Ripple';
import './LinkCard.css';

/**
 * @param {string} link
 * @returns {Promise<string>}
 */
const CreateQRDataUrl = (link) => QRCode.toDataURL(link, { errorCorrectionLevel: 'H', margin: 4, width: 800 });

/**
 * @param {{ createdId: string, createdTo: string, }} props
 */
export default function LinkCard({ createdId, createdTo }) {
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState('');
  const fullLink = `https://${process.env.REACT_APP_DOMAIN}/${createdId}`;

  CreateQRDataUrl(fullLink)
    .then((createdQRCodeDataUrl) => setQRCodeDataUrl(createdQRCodeDataUrl))
    .catch((e) => {
      dispatcher.call('message', `Couldn't create link`);
      LogMessageOrError(e);
    });

  const Copy = () => {
    navigator.clipboard
      .writeText(fullLink)
      .then(() => dispatcher.call('message', 'Shortened link copied'))
      .catch(LogMessageOrError);
  };

  return (
    <div className="link-card">
      <div className="link-card__title">
        <div className="link-card__link default-title-font">
          {process.env.REACT_APP_DOMAIN}/{createdId}
        </div>
        <div className="link-card__copy default-pointer default-no-select" onClick={Copy}>
          <i className="material-icons">copy</i>
          <Ripple />
        </div>
      </div>
      <img src={qrCodeDataUrl} alt="QR-code" className="link-card__image" />
      <div className="link-card__to">
        Leads to{' '}
        <a target="_blank" rel="noopener noreferrer" href={createdTo} className="link-card__to--underline">
          {createdTo}
        </a>
      </div>
    </div>
  );
}

LinkCard.propTypes = {
  createdId: PropTypes.string.isRequired,
  createdTo: PropTypes.string.isRequired,
};
