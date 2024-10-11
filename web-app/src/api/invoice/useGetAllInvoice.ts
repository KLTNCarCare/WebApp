import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { GetInvoiceParams, InvoiceResponse } from './types';

export const getListInvoiceFn = async (params: GetInvoiceParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<InvoiceResponse>(
    apiRoutes.invoice.getAllInvoice,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetListInvoice = (
  params: GetInvoiceParams,
  opts?: UseQueryOptions<InvoiceResponse, DefaultQueryError>
) =>
  useQuery<InvoiceResponse, DefaultQueryError>(
    [apiRoutes.invoice.getAllInvoice, params],
    () => getListInvoiceFn(params),
    opts
  );
