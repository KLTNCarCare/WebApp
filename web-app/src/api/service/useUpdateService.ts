import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { UpdateServiceFn } from './types';
import { ServiceByCategory } from '../category/useGetServiceByCategory';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const updateServiceFn = async (
  data: UpdateServiceFn
): Promise<ServiceByCategory> => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<ServiceByCategory>(
    `${apiRoutes.service.update}/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdateService = (
  opts?: UseMutationOptions<
    ServiceByCategory,
    DefaultQueryError,
    UpdateServiceFn
  >
) =>
  useMutation<ServiceByCategory, DefaultQueryError, UpdateServiceFn>(
    (data) => updateServiceFn(data),
    opts
  );
