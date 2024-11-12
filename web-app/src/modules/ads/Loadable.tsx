/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const AdsPage = lazyLoad(
  () => import('./AdsPage'),
  (module) => module.AdsPage
);
