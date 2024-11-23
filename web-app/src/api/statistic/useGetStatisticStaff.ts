import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { StaffStatistics, StatisticParams } from './types';

export const getStatisticStaffFn = async (params: StatisticParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<StaffStatistics>(
    apiRoutes.statistic.getStatisticStaff,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetStatisticStaff = (
  params: StatisticParams,
  opts?: UseQueryOptions<StaffStatistics, DefaultQueryError>
) =>
  useQuery<StaffStatistics, DefaultQueryError>(
    [
      apiRoutes.statistic.getStatisticStaff,
      params.fromDate,
      params.toDate,
      params.page,
      params.limit,
    ],
    () => getStatisticStaffFn(params),
    opts
  );
