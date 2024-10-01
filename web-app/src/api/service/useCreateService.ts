import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { CreateServiceFn } from './types';
import { ServiceByCategory } from '../category/useGetServiceByCategory';

export const createServiceFn = async (
  data: CreateServiceFn
): Promise<ServiceByCategory> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<ServiceByCategory>(
    apiRoutes.service.create,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCreateService = (
  opts?: UseMutationOptions<
    ServiceByCategory,
    DefaultQueryError,
    CreateServiceFn
  >
) =>
  useMutation<ServiceByCategory, DefaultQueryError, CreateServiceFn>(
    (data) => createServiceFn(data),
    opts
  );
