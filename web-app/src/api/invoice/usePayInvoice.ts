import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { ConfirmPayInvoiceFn } from './types';

export const confirmPayInvoice = async (data: ConfirmPayInvoiceFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.post(
    apiRoutes.invoice.payInvoice(data.appointmentId), // Use appointmentId instead of invoiceId
    new URLSearchParams({ paymentMethod: data.paymentMethod }), // Send as URL-encoded form data
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
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
