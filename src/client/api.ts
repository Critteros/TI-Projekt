import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import type { TokenResponse } from '@/common/dto/auth';

let accessToken: string | null = null;

const jsonContentHeader = {
  'Content-Type': 'application/json',
};

const publicClient = axios.create({
  headers: { ...jsonContentHeader },
});

const getSession = () => window.session;

const refreshAccessToken = async () => {
  const {
    data: { token },
  } = await publicClient.get<TokenResponse>('/api/auth/token');
  accessToken = token;
  return token;
};

const privateClient = axios.create({
  headers: { ...jsonContentHeader },
  withCredentials: true,
});

privateClient.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!config.headers['Authorization'] && accessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;
    if (error.response?.status === StatusCodes.UNAUTHORIZED && !prevRequest.sent) {
      prevRequest.sent = true; //Prevent infinite loops
      try {
        const token = await refreshAccessToken();
        prevRequest.headers.set('Authorization', `Bearer ${token}`);
        return privateClient(prevRequest);
      } catch (error) {
        window.session = null;
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export const api = {
  public: publicClient,
  private: privateClient,
  getSession,
};
