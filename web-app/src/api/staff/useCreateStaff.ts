import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { CreateStaffFn, Staff } from './types';

export const createStaffFn = async (data: CreateStaffFn): Promise<Staff> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<Staff>(apiRoutes.staff.create, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const useCreateStaff = (
  opts?: UseMutationOptions<Staff, DefaultQueryError, CreateStaffFn>
) =>
  useMutation<Staff, DefaultQueryError, CreateStaffFn>(
    (data) => createStaffFn(data),
    opts
  );
