import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { RefundStatistics, StatisticParams } from './types';

export const getStatisticServiceRefundFn = async (params: StatisticParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<RefundStatistics>(
    apiRoutes.statistic.getStatisticRefund,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetStatisticServiceRefund = (
  params: StatisticParams,
  opts?: UseQueryOptions<RefundStatistics, DefaultQueryError>
) =>
  useQuery<RefundStatistics, DefaultQueryError>(
    [
      apiRoutes.statistic.getStatisticRefund,
      params.fromDate,
      params.toDate,
      params.page,
      params.limit,
    ],
    () => getStatisticServiceRefundFn(params),
    opts
  );
