/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const SignInPage = lazyLoad(
  () => import('./SignInPage'),
  (module) => module.SignInPage
);
