import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Customer, UpdateCustomerFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updateCustomerFn = async (id: string, data: UpdateCustomerFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<Customer>(
    `${apiRoutes.customer.update}/${id}`,
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

export const useUpdateCustomer = (
  opts?: UseMutationOptions<
    Customer,
    DefaultQueryError,
    { id: string; data: UpdateCustomerFn }
  >
) =>
  useMutation<
    Customer,
    DefaultQueryError,
    { id: string; data: UpdateCustomerFn }
  >(({ id, data }) => updateCustomerFn(id, data), opts);
