import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { InactivePriceCatalogFn } from './types';

export const inactivePriceCatalog = async (data: InactivePriceCatalogFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.priceCatalog.inactive(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useInactivePriceCatalog = (
  opts?: UseMutationOptions<void, DefaultQueryError, InactivePriceCatalogFn>
) =>
  useMutation<void, DefaultQueryError, InactivePriceCatalogFn>(
    (data) => inactivePriceCatalog(data),
    opts
  );
