import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { DeletePriceCatalogFn } from './types';

export const deletePriceCatalog = async (data: DeletePriceCatalogFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.priceCatalog.delete(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeletePriceCatalog = (
  opts?: UseMutationOptions<void, DefaultQueryError, DeletePriceCatalogFn>
) =>
  useMutation<void, DefaultQueryError, DeletePriceCatalogFn>(
    (data) => deletePriceCatalog(data),
    opts
  );