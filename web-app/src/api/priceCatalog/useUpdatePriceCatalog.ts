import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { PriceCatalog, UpdatePriceCatalogFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updatePriceCatalogFn = async (
  id: string,
  data: UpdatePriceCatalogFn
) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<PriceCatalog>(
    `${apiRoutes.priceCatalog.update}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdatePriceCatalog = (
  opts?: UseMutationOptions<
    PriceCatalog,
    DefaultQueryError,
    { id: string; data: UpdatePriceCatalogFn }
  >
) =>
  useMutation<
    PriceCatalog,
    DefaultQueryError,
    { id: string; data: UpdatePriceCatalogFn }
  >(({ id, data }) => updatePriceCatalogFn(id, data), opts);
