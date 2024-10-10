import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { ConfirmPayInvoiceFn } from './types';

export const confirmPayInvoice = async (data: ConfirmPayInvoiceFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.invoice.payInvoice(data.invoiceId),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useConfirmPayInvoice = (
  opts?: UseMutationOptions<void, DefaultQueryError, ConfirmPayInvoiceFn>
) =>
  useMutation<void, DefaultQueryError, ConfirmPayInvoiceFn>(
    (data) => confirmPayInvoice(data),
    opts
  );
