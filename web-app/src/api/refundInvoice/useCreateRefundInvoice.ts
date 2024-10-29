import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { CreateRefundInvoiceFn, Invoice } from './types';
import qs from 'qs';

export const createRefundInvoiceFn = async (
  data: CreateRefundInvoiceFn
): Promise<Invoice> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<{
    code: number;
    message: string;
    data: Invoice;
  }>(
    `${apiRoutes.invoice.createRefund}/${data.invoiceId}`,
    qs.stringify({ reason: data.reason }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.data.code === 200 && response.data.data) {
    return response.data.data;
  } else {
    throw new Error('Failed to create refund invoice');
  }
};

export const useCreateRefundInvoice = (
  options?: UseMutationOptions<
    Invoice,
    DefaultQueryError,
    CreateRefundInvoiceFn
  >
) => {
  return useMutation<Invoice, DefaultQueryError, CreateRefundInvoiceFn>(
    createRefundInvoiceFn,
    options
  );
};
