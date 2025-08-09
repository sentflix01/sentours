/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leafletMap';
import { login } from './login';

//DOM ELEMENT
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // value
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
