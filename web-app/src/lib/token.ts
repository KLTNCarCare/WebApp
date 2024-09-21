import { getCookie, removeCookie, setCookie } from './cookies';
import dayjs from 'dayjs';

export const ACCESS_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// Lấy access token
export const getAccessToken = () => {
  try {
    const token = getCookie(ACCESS_TOKEN_KEY);
    console.log('Access token retrieved:', token);
    return token || null;
  } catch (err) {
    console.error('Error retrieving access token:', err);
    return null;
  }
};

// Lấy refresh token
export const getRefreshToken = () => {
  try {
    const token = getCookie(REFRESH_TOKEN_KEY);
    console.log('Refresh token retrieved:', token);
    return token || null;
  } catch (err) {
    console.error('Error retrieving refresh token:', err);
    return null;
  }
};

export const storeAccessToken = (accessToken: string): void => {
  try {
    console.log('Storing access token:', accessToken);
    setCookie(ACCESS_TOKEN_KEY, accessToken, {
      // expires: dayjs().add(3, 'month').toDate(),
      // sameSite: 'none', // Hoặc 'lax', tùy thuộc vào nhu cầu
      secure: false, // Đặt là false cho HTTP
    });
    console.log('Access token stored successfully');
  } catch (error) {
    console.error('Failed to store access token:', error);
  }
};

export const storeRefreshToken = (refreshToken: string): void => {
  try {
    console.log('Storing refresh token:', refreshToken);
    setCookie(REFRESH_TOKEN_KEY, refreshToken, {
      secure: false, // Đặt là false cho HTTP
    });
    console.log('Refresh token stored successfully');
  } catch (error) {
    console.error('Failed to store refresh token:', error);
  }
};

// Xóa access token
export const removeAccessToken = (): void => {
  try {
    console.log('Removing access token');
    removeCookie(ACCESS_TOKEN_KEY);
    console.log('Access token removed successfully');
  } catch (error) {
    console.error('Error removing access token:', error);
  }
};

// Xóa refresh token
export const removeRefreshToken = (): void => {
  try {
    console.log('Removing refresh token');
    removeCookie(REFRESH_TOKEN_KEY);
    console.log('Refresh token removed successfully');
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
};
