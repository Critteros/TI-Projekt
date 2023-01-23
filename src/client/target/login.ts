import '$css/styles.css';
import '$css/authPage.css';
import { api } from '@/client/api';
import { AxiosError } from 'axios';

document.querySelector('form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const object = Object.fromEntries(formData.entries());

  try {
    await api.public.post('/api/auth/login', object);
    window.location.replace('/');
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log(e);
      alert(e.response?.data.error);
    }
  }
});

export {};
