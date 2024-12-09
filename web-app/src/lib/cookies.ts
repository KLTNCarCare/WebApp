import Cookies from 'js-cookie';

export const getCookie = (name: string) => {
  const value = Cookies.get(name);
  return value;
};

export const setCookie = (
  name: string,
  value: string,
  options: Cookies.CookieAttributes = {}
) => {
  return Cookies.set(name, value, {
    domain: window.location.hostname,
    path: '/',
    ...options,
  });
};

export const removeCookie = (
  name: string,
  options: Cookies.CookieAttributes = {}
) => {
  return Cookies.remove(name, {
    domain: window.location.hostname,
    path: '/',
    ...options,
  });
};
