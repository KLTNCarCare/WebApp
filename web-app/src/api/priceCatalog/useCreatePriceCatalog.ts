import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { CreatePriceCatalogFn, PriceCatalog } from './types';
export const createPriceCatalogFn = async (
  data: CreatePriceCatalogFn
): Promise<PriceCatalog> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<PriceCatalog>(
    apiRoutes.priceCatalog.create,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCreatePriceCatalog = (
  opts?: UseMutationOptions<
    PriceCatalog,
    DefaultQueryError,
    CreatePriceCatalogFn
  >
) =>
  useMutation<PriceCatalog, DefaultQueryError, CreatePriceCatalogFn>(
    (data) => createPriceCatalogFn(data),
    opts
  );
