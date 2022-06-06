import dispatcher from '../dispatcher';

export default function PopupNoPermission() {
  /** @type {import("../../components/Popup").PopupPayload} */
  const popupPayload = {
    title: 'Whoa…',
    messages: [`Looks like you have insufficient rights. Begone!`],
    hideable: true,
  };

  dispatcher.call('popup', popupPayload);
}
