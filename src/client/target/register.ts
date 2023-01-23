import '$css/styles.css';
import '$css/authPage.css';

import { api } from '@/client/api';
import { AxiosError } from 'axios';

const test = async () => {
  const { data } = await api.private.get('/api/session');
  console.log(data);
};
test();

document.querySelector('form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const object = Object.fromEntries(formData.entries());

  try {
    await api.public.post('/api/auth/register', object);
    window.location.replace('/');
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(e);
      alert(e.response?.data.error);
    }
  }
});

export {};
