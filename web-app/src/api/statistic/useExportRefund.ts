import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { RefundStatistics, ExportParams } from './types';

export const exportStatisticRefundFn = async (params: ExportParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<RefundStatistics>(
    apiRoutes.statistic.exportRefund,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useExportStatisticRefund = (
  params: ExportParams,
  opts?: UseQueryOptions<RefundStatistics, DefaultQueryError>
) =>
  useQuery<RefundStatistics, DefaultQueryError>(
    [apiRoutes.statistic.exportRefund, params.fromDate, params.toDate],
    () => exportStatisticRefundFn(params),
    opts
  );
