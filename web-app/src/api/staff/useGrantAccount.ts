import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { GrantAccountFn, Staff } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const grantAccountFn = async (id: string, data: GrantAccountFn) => {
  const token = getCookie('accessToken');
  const params = new URLSearchParams();
  params.append('password', data.password);

  const response = await httpClient.put<Staff>(
    `${apiRoutes.staff.grantAccount}/${id}`,
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};

export const useGrantAccount = (
  opts?: UseMutationOptions<
    Staff,
    DefaultQueryError,
    { id: string; data: GrantAccountFn }
  >
) =>
  useMutation<Staff, DefaultQueryError, { id: string; data: GrantAccountFn }>(
    ({ id, data }) => grantAccountFn(id, data),
    opts
  );
