/* eslint-disable */
// type is 'success' or 'error'

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 1500);
};

// export const showAlert = (type, msg) => {
//   hideAlert();
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//   console.log('Alert shown, will hide in 1.5s');
//   window.setTimeout(() => {
//     console.log('Hiding alert now');
//     hideAlert();
//   }, 1500);
// };
