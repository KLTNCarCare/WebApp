import { DefaultQueryError } from 'src/api/type';
import axios from 'axios';
import { getCookie } from './cookies';
import { ACCESS_TOKEN_KEY, removeAccessToken } from './token';

import { apiUrl, API_FETCH_TIMEOUT, epApiUrl, EP_API_KEY } from './constants';
import apiRoutes from './apiRoutes';

export const publicHttpClient = axios.create({
  baseURL: apiUrl,
  timeout: API_FETCH_TIMEOUT * 1000,
});

const httpClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: API_FETCH_TIMEOUT * 1000,
});

export const epHttpClient = axios.create({
  baseURL: epApiUrl,
  timeout: API_FETCH_TIMEOUT * 1000,
  headers: {
    'Content-Type': 'application/json',
    'auth-key': EP_API_KEY,
  },
});

httpClient.defaults.headers.common['Content-Type'] = 'application/json';

httpClient.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie(ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error: DefaultQueryError) => {
    const accessToken = getCookie(ACCESS_TOKEN_KEY);
    if (
      error.response?.config.url === apiRoutes.admin.profile &&
      !!accessToken
    ) {
      removeAccessToken();
      window.location.reload();

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
