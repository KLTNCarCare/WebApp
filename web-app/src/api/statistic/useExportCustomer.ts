import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { CustomerStatistics, ExportParams } from './types';

export const exportStatisticCustomerFn = async (params: ExportParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<CustomerStatistics>(
    apiRoutes.statistic.exportCustomer,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useExportStatisticCustomer = (
  params: ExportParams,
  opts?: UseQueryOptions<CustomerStatistics, DefaultQueryError>
) =>
  useQuery<CustomerStatistics, DefaultQueryError>(
    [apiRoutes.statistic.exportCustomer, params.fromDate, params.toDate],
    () => exportStatisticCustomerFn(params),
    opts
  );
