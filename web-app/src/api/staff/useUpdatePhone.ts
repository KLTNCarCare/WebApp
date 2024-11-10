import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Staff, UpdatePhoneStaffFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updatePhoneStaffFn = async (
  id: string,
  data: UpdatePhoneStaffFn
) => {
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

export const useUpdatePhoneStaff = (
  opts?: UseMutationOptions<
    Staff,
    DefaultQueryError,
    { id: string; data: UpdatePhoneStaffFn }
  >
) =>
  useMutation<
    Staff,
    DefaultQueryError,
    { id: string; data: UpdatePhoneStaffFn }
  >(({ id, data }) => updatePhoneStaffFn(id, data), opts);
