import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { StaffStatistics, ExportParams } from './types';

export const exportStatisticStaffFn = async (params: ExportParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<StaffStatistics>(
    apiRoutes.statistic.exportStaff,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useExportStatisticStaff = (
  params: ExportParams,
  opts?: UseQueryOptions<StaffStatistics, DefaultQueryError>
) =>
  useQuery<StaffStatistics, DefaultQueryError>(
    [apiRoutes.statistic.exportStaff, params.fromDate, params.toDate],
    () => exportStatisticStaffFn(params),
    opts
  );
