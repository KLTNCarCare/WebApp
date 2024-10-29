import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { PayZaloPayFn, PaymentResponse } from './types';

export const payZaloPay = async (data: PayZaloPayFn): Promise<string> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<PaymentResponse>(
    apiRoutes.payment.payZaloPay(data.appointmentId),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.data.order_url;
};

export const usePayZaloPay = (
  opts?: UseMutationOptions<string, DefaultQueryError, PayZaloPayFn>
) =>
  useMutation<string, DefaultQueryError, PayZaloPayFn>(
    (data) => payZaloPay(data),
    opts
  );
