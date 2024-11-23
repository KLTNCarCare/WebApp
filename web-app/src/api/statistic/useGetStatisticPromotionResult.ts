import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { PromotionStatistics, StatisticParams } from './types';

export const getStatisticPromotionResultFn = async (
  params: StatisticParams
) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<PromotionStatistics>(
    apiRoutes.statistic.getStatisticPromotion,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetStatisticPromotionResult = (
  params: StatisticParams,
  opts?: UseQueryOptions<PromotionStatistics, DefaultQueryError>
) =>
  useQuery<PromotionStatistics, DefaultQueryError>(
    [
      apiRoutes.statistic.getStatisticPromotion,
      params.fromDate,
      params.toDate,
      params.page,
      params.limit,
    ],
    () => getStatisticPromotionResultFn(params),
    opts
  );
