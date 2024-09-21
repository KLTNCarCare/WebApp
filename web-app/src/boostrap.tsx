// import FontFaceObserver from 'fontfaceobserver';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// import { __prod__ } from './lib/constants';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/i18n';

// Observe loading of Gilroy (to remove 'Gilroy', remove the <link> tag in
// the index.html file and this observer)
// const gilroyObserver = new FontFaceObserver('SVN Gilroy', {});

// When Gilroy is loaded, add a font-family using Gilroy to the body
// gilroyObserver.load().then(() => {
//   document.body.classList.add('font-gilroy');
// });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// if (__prod__) {
//   console.log = () => {};
//   console.error = () => {};
//   console.debug = () => {};
// }

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
