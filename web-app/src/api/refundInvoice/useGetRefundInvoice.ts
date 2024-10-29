import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { GetInvoiceParams } from '../invoice/types';
import { RefundInvoiceResponse } from './types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';

export const getRefundInvoiceFn = async (params: GetInvoiceParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<RefundInvoiceResponse>(
    apiRoutes.invoice.getRefundInvoice,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetRefundInvoice = (
  params: GetInvoiceParams,
  opts?: UseQueryOptions<RefundInvoiceResponse, DefaultQueryError>
) =>
  useQuery<RefundInvoiceResponse, DefaultQueryError>(
    [apiRoutes.invoice.getRefundInvoice, params],
    () => getRefundInvoiceFn(params),
    opts
  );
