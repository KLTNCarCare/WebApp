import { getCookie, removeCookie, setCookie } from './cookies';
import dayjs from 'dayjs';

export const ACCESS_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const getAccessToken = () => {
  try {
    const token = getCookie(ACCESS_TOKEN_KEY);
    return token || null;
  } catch (err) {
    return null;
  }
};

export const getRefreshToken = () => {
  try {
    const token = getCookie(REFRESH_TOKEN_KEY);
    return token || null;
  } catch (err) {
    return null;
  }
};

export const storeAccessToken = (accessToken: string): void => {
  try {
    setCookie(ACCESS_TOKEN_KEY, accessToken, {
      // expires: dayjs().add(3, 'month').toDate(),
      // sameSite: 'none',
      secure: false,
    });
  } catch (error) {}
};

export const storeRefreshToken = (refreshToken: string): void => {
  try {
    setCookie(REFRESH_TOKEN_KEY, refreshToken, {
      secure: false,
    });
  } catch (error) {}
};

export const removeAccessToken = (): void => {
  try {
    removeCookie(ACCESS_TOKEN_KEY);
  } catch (error) {}
};

export const removeRefreshToken = (): void => {
  try {
    removeCookie(REFRESH_TOKEN_KEY);
  } catch (error) {}
};
