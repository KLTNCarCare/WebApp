import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { CreateCustomerFn, Customer } from './types';

export const createCustomerFn = async (
  data: CreateCustomerFn
): Promise<Customer> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<Customer>(
    apiRoutes.customer.create,
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

export const useCreateCustomer = (
  opts?: UseMutationOptions<Customer, DefaultQueryError, CreateCustomerFn>
) =>
  useMutation<Customer, DefaultQueryError, CreateCustomerFn>(
    (data) => createCustomerFn(data),
    opts
  );
