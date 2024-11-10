import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import apiRoutes from 'src/lib/apiRoutes';
import { ApiResponse } from './types';

export const getAllStaffFn = async (
  page: number | null,
  limit: number | null,
  field: string | null,
  word: string | null
): Promise<ApiResponse> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<ApiResponse>(apiRoutes.staff.list, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      page,
      limit,
      field,
      word,
    },
  });
  return response.data;
};

export const useGetAllStaff = (
  page: number | null,
  limit: number | null,
  field: string | null,
  word: string | null,
  options?: UseQueryOptions<ApiResponse, DefaultQueryError>
) => {
  return useQuery<ApiResponse, DefaultQueryError>(
    ['getAllStaff', page, limit],
    () => getAllStaffFn(page, limit, field, word),
    options
  );
};
