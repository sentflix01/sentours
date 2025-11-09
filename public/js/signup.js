/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
      timeout: 30000,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Signup successful! Check your email to verify your account.',
      );
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Signup failed. Try again!',
    );
  }
};
