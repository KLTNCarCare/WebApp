import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { CustomerStatistics, StatisticParams } from './types';

export const getStatisticCustomerFn = async (params: StatisticParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<CustomerStatistics>(
    apiRoutes.statistic.getStatisticCustomer,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetStatisticCustomer = (
  params: StatisticParams,
  opts?: UseQueryOptions<CustomerStatistics, DefaultQueryError>
) =>
  useQuery<CustomerStatistics, DefaultQueryError>(
    [
      apiRoutes.statistic.getStatisticCustomer,
      params.fromDate,
      params.toDate,
      params.page,
      params.limit,
    ],
    () => getStatisticCustomerFn(params),
    opts
  );
