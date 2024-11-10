import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Staff, UpdateStaffFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updateStaffFn = async (id: string, data: UpdateStaffFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<Staff>(
    `${apiRoutes.staff.update}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const useUpdateStaff = (
  opts?: UseMutationOptions<
    Staff,
    DefaultQueryError,
    { id: string; data: UpdateStaffFn }
  >
) =>
  useMutation<Staff, DefaultQueryError, { id: string; data: UpdateStaffFn }>(
    ({ id, data }) => updateStaffFn(id, data),
    opts
  );
