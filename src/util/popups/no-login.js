import dispatcher from '../dispatcher';

export default function PopupNoLogin() {
  /** @type {import("../../components/Popup").PopupPayload} */
  const popupPayload = {
    title: 'Whoa…',
    messages: [`Looks like you are not logged in!`],
    hideable: true,
  };

  dispatcher.call('popup', popupPayload);
}
