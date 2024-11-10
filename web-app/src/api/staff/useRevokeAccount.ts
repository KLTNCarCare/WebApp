import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Staff } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const revokeAccountFn = async (id: string) => {
  const token = getCookie('accessToken');

  const response = await httpClient.put<Staff>(
    `${apiRoutes.staff.revokeAccount}/${id}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};

export const useRevokeAccount = (
  opts?: UseMutationOptions<Staff, DefaultQueryError, string>
) =>
  useMutation<Staff, DefaultQueryError, string>(
    (id) => revokeAccountFn(id),
    opts
  );
