import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { ActiveStatusFn } from './types';
import { getCookie } from 'src/lib/cookies';

export const ActiveStatus = async (data: ActiveStatusFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.category.active(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useActiveStatus = (
  opts?: UseMutationOptions<void, DefaultQueryError, ActiveStatusFn>
) =>
  useMutation<void, DefaultQueryError, ActiveStatusFn>(
    (data) => ActiveStatus(data),
    opts
  );
