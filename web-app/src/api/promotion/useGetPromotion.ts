import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { PromotionLine } from '../promotionLine/useGetPromotionLine';

export interface GetPromotionParams {
  page: number;
  limit: number;
  field?: string;
  word?: string;
}
export interface PromotionResponse {
  data: PromotionManagement[];
  totalPage: number;
}
export interface PromotionManagement {
  _id: string;
  promotionId: string;
  promotionName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  __v: number;
  updatedAt: string;
  createdAt: string;
  items: PromotionLine[];
}

export const getListPromotionFn = async (params: GetPromotionParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<PromotionResponse>(
    apiRoutes.promotion.list,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetListPromotion = (
  params: GetPromotionParams,
  opts?: UseQueryOptions<PromotionResponse, DefaultQueryError>
) =>
  useQuery<PromotionResponse, DefaultQueryError>(
    [apiRoutes.promotion.list, params],
    () => getListPromotionFn(params),
    opts
  );
