/**
 * Asynchronously loads the component for home pages
 */

import { lazyLoad } from 'src/lib/loadable';

export const InvoicePage = lazyLoad(
  () => import('./InvoicePage'),
  (module) => module.InvoicePage
);
