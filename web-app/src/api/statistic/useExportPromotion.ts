import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { PromotionStatistics, ExportParams } from './types';

export const exportStatisticPromotionFn = async (params: ExportParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<PromotionStatistics>(
    apiRoutes.statistic.exportPromotion,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useExportStatisticPromotion = (
  params: ExportParams,
  opts?: UseQueryOptions<PromotionStatistics, DefaultQueryError>
) =>
  useQuery<PromotionStatistics, DefaultQueryError>(
    [apiRoutes.statistic.exportPromotion, params.fromDate, params.toDate],
    () => exportStatisticPromotionFn(params),
    opts
  );
