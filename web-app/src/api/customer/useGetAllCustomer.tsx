import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import apiRoutes from 'src/lib/apiRoutes';
import { ApiResponse, Customer } from './types';

export const getAllCustomerFn = async (
  page: number | null,
  limit: number | null,
  field: string | null,
  word: string | null
): Promise<ApiResponse> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<ApiResponse>(apiRoutes.customer.list, {
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

export const useGetAllCustomer = (
  page: number | null,
  limit: number | null,
  field: string | null,
  word: string | null,
  options?: UseQueryOptions<ApiResponse, DefaultQueryError>
) => {
  return useQuery<ApiResponse, DefaultQueryError>(
    ['getAllCustomer', page, limit],
    () => getAllCustomerFn(page, limit, field, word),
    options
  );
};
