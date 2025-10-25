/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
      timeout: 30000, // 30 second timeout
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully! Welcome to Natours!');
      // Clear the form
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('passwordConfirm').value = '';

      // Redirect after a short delay
      window.setTimeout(() => {
        window.location.assign('/');
      }, 2000);
    }
  } catch (err) {
    console.error('Signup error:', err);
    if (err.response && err.response.data && err.response.data.message) {
      showAlert('error', err.response.data.message);
    } else if (err.code === 'ECONNABORTED') {
      showAlert('error', 'Request timeout. Please try again.');
    } else {
      showAlert('error', 'Something went wrong! Please try again.');
    }
  }
};
