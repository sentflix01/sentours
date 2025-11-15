/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import { getApiUrl } from './config';

export const login = async (email, password, button) => {
  // Store original button text
  const originalText = button ? button.textContent : 'Login';

  // Update button text to show loading state
  if (button) {
    button.textContent = 'Log in...';
    button.disabled = true;
  }

  try {
    const res = await axios({
      method: 'POST',
      url: getApiUrl('/api/v1/users/login'),
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      if (button) {
        button.textContent = 'Success!';
      }
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // Restore original button text on error
    if (button) {
      button.textContent = originalText;
      button.disabled = false;
    }
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.location.href = '/';
      // location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
