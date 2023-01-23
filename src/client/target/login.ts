import '$css/styles.css';
import '$css/authPage.css';
import { AxiosError } from 'axios';
import Toastify from 'toastify-js';

import { api } from '@/client/api';

const run = () => {
  document.querySelector('form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formEl = event.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const object = Object.fromEntries(formData.entries());

    try {
      await api.public.post('/api/auth/login', object);
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
};

window.addEventListener('load', () => {
  run();
});

export {};
