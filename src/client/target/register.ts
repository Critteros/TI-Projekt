import '$css/styles.css';
import '$css/authPage.css';

import Toastify from 'toastify-js';

import { api } from '@/client/api';
import { AxiosError } from 'axios';

document.querySelector('form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formEl = event.target as HTMLFormElement;
  const formData = new FormData(formEl);
  const object = Object.fromEntries(formData.entries());

  try {
    await api.public.post('/api/auth/register', object);
    window.location.replace('/');
  } catch (e) {
    if (e instanceof AxiosError) {
      Toastify({
        text: e.response?.data.error,
        duration: 3000,
        newWindow: true,
        close: true,
        className: 'notification',
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();

      formEl.reset();
    }
  }
});

export {};
