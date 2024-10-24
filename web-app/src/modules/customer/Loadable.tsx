/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const DashboardPage = lazyLoad(
  () => import('./CustomerPage'),
  (module) => module.CustomerPage
);
