import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DeleteServiceFn } from './types';
import { getCookie } from 'src/lib/cookies';

export const deleteService = async (data: DeleteServiceFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.service.delete(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeleteService = (
  opts?: UseMutationOptions<void, DefaultQueryError, DeleteServiceFn>
) =>
  useMutation<void, DefaultQueryError, DeleteServiceFn>(
    (data) => deleteService(data),
    opts
  );
