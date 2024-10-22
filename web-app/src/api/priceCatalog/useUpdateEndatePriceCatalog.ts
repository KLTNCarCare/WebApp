import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { PriceCatalog, UpdateEndatePriceCatalogFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updateEndatePriceCatalogFn = async (
  id: string,
  data: UpdateEndatePriceCatalogFn
) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<PriceCatalog>(
    `${apiRoutes.priceCatalog.updateEndDate}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdateEndatePriceCatalog = (
  opts?: UseMutationOptions<
    PriceCatalog,
    DefaultQueryError,
    { id: string; data: UpdateEndatePriceCatalogFn }
  >
) =>
  useMutation<
    PriceCatalog,
    DefaultQueryError,
    { id: string; data: UpdateEndatePriceCatalogFn }
  >(({ id, data }) => updateEndatePriceCatalogFn(id, data), opts);
