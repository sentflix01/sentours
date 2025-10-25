/* eslint-disable */
// type is 'success' or 'error'

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
// type is 'success' or 'error'
// time is the time in milliseconds to hide the alert
// default is 7 seconds

export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, (time = 1000));
};
