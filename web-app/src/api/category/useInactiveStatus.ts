import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { InactiveStatusFn } from './types';
import { getCookie } from 'src/lib/cookies';

export const inactiveStatus = async (data: InactiveStatusFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.category.delete(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeleteCategory = (
  opts?: UseMutationOptions<void, DefaultQueryError, InactiveStatusFn>
) =>
  useMutation<void, DefaultQueryError, InactiveStatusFn>(
    (data) => inactiveStatus(data),
    opts
  );
