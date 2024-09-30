/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const PriceCatalogPage = lazyLoad(
  () => import('./PriceCatalogPage'),
  (module) => module.PriceCatalogPage
);
