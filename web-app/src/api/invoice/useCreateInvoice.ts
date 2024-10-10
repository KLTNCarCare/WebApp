import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { CreateInvoiceFn, Invoice } from './types';
import qs from 'qs';

export const createInvoiceFn = async (
  data: CreateInvoiceFn
): Promise<Invoice> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<{
    code: number;
    message: string;
    data: Invoice;
  }>(`${apiRoutes.invoice.create}/${data.appointmentId}`, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.data.code === 200 && response.data.data) {
    return response.data.data;
  } else {
    throw new Error('Failed to create invoice');
  }
};

export const useCreateInvoice = (
  opts?: UseMutationOptions<Invoice, DefaultQueryError, CreateInvoiceFn>
) =>
  useMutation<Invoice, DefaultQueryError, CreateInvoiceFn>(
    (data) => createInvoiceFn(data),
    opts
  );
