/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://sentours.onrender.com/api/v1/users/signup',
      withCredentials: true,
      data: { name, email, password, passwordConfirm },
      timeout: 300000,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        res.data.message ||
          'Signup successful! Please check your email to verify your account before logging in.',
      );
      setTimeout(() => {
        window.location.assign('/login');
      }, 3000);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Signup failed. Please try again!',
    );
  }
};
