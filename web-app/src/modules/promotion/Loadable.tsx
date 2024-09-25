/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const PromotionPage = lazyLoad(
  () => import('./PromotionPage'),
  (module) => module.PromotionPage
);
