/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leafletMap';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
//DOM ELEMENT
const leaflet = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // value
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // value
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    console.log('Tour ID:', tourId); // Debug log
    bookTour(tourId);
  });
  console.log('Book button found:', bookBtn); // Debug log
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

// Facebook-style: Show only 1 default comment (and its latest reply) per tour on load
window.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('[data-tour-id]').forEach(async (el) => {
    const tourId = el.getAttribute('data-tour-id');
    const commentsContainer = document.getElementById(
      `comments-container-${tourId}`,
    );
    if (!commentsContainer) return;
    try {
      const response = await fetch(`/api/v1/tours/${tourId}/comments/default`);
      const data = await response.json();
      if (data.status === 'success' && data.data.comment) {
        const comment = data.data.comment;
        const reply = data.data.latestReply;
        // Render the comment
        let html = `<div class="comment-item">
          <div class="comment-header">
            <img class="comment-avatar" src="/img/users/${comment.user.photo || 'default.jpg'}" alt="${comment.user.name}">
            <div class="comment-info">
              <span class="comment-author">${comment.user.name}</span>
              <span class="comment-time">${new Date(comment.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div class="comment-content">
            <p class="comment-text">${comment.text}</p>
            ${comment.photo ? `<img class="comment-photo" src="/img/comments/${comment.photo}" alt="comment photo">` : ''}
          </div>`;
        if (reply) {
          html += `<div class="comment-replies">
            <div class="comment-reply">
              <img class="reply-avatar" src="/img/users/${reply.user.photo || 'default.jpg'}" alt="${reply.user.name}">
              <div class="reply-content">
                <span class="reply-author">${reply.user.name}</span>
                <span class="reply-text">${reply.text}</span>
                <span class="reply-time">${new Date(reply.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>`;
        }
        html += '</div>';
        commentsContainer.innerHTML = html;
      } else {
        commentsContainer.innerHTML =
          '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      }
    } catch (error) {
      commentsContainer.innerHTML =
        '<p class="no-comments">Could not load comments.</p>';
    }
  });
});
