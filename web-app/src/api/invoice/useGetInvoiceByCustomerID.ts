import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { GetInvoiceByCustomerIDFn, Invoice } from './types';

export const getInvoiceByCustomerIDFn = async (
  params: GetInvoiceByCustomerIDFn
): Promise<Invoice> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<{
    code: number;
    message: string;
    data: Invoice;
  }>(`${apiRoutes.invoice.getInvoiceByCustomerID}/${params.customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.data.code === 200 && response.data.data) {
    return response.data.data;
  } else {
    throw new Error('Failed to fetch invoice');
  }
};

export const useGetInvoiceByCustomerID = (
  params: GetInvoiceByCustomerIDFn,
  options?: UseQueryOptions<Invoice, DefaultQueryError>
) => {
  return useQuery<Invoice, DefaultQueryError>(
    ['invoice', params],
    () => getInvoiceByCustomerIDFn(params),
    options
  );
};
