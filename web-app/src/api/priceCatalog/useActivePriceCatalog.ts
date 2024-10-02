import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { ActivePriceCatalogFn } from './types';

export const activePriceCatalog = async (data: ActivePriceCatalogFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.priceCatalog.active(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useActivePriceCatalog = (
  opts?: UseMutationOptions<void, DefaultQueryError, ActivePriceCatalogFn>
) =>
  useMutation<void, DefaultQueryError, ActivePriceCatalogFn>(
    (data) => activePriceCatalog(data),
    opts
  );
