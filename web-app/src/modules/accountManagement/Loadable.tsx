/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const AccountPage = lazyLoad(
  () => import('./AccountPage'),
  (module) => module.AccountPage
);
