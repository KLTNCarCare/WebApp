import Cookies from 'js-cookie';

export const getCookie = (name: string) => {
  const value = Cookies.get(name);
  console.log(`Getting cookie: ${name} = ${value}`);
  return value;
};

export const setCookie = (
  name: string,
  value: string,
  options: Cookies.CookieAttributes = {}
) => {
  console.log(`Setting cookie: ${name}=${value}`, options);
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
  console.log(`Removing cookie: ${name}`);
  return Cookies.remove(name, {
    path: '/',
    ...options,
  });
};
