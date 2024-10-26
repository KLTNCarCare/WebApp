import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export interface Detail {
  _id: string;
  code: string;
  status: string;
  description: string;
  itemId?: string;
  itemName?: string;
  discount: number;
  bill?: number;
  limitDiscount?: number;
}

export interface PromotionLine {
  _id: string;
  code: string;
  lineId: string;
  parentId: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'discount-service' | 'discount-bill';
  status: 'active' | 'inactive' | 'expired';
  detail: Detail[];
}

export const getPromotionLinesFn = async (
  promotionId: string
): Promise<PromotionLine[]> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<PromotionLine[]>(
    `${apiRoutes.promotion.getLineByParentId}/${promotionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetPromotionLines = (
  promotionId: string,
  opts?: UseQueryOptions<PromotionLine[], DefaultQueryError>
) =>
  useQuery<PromotionLine[], DefaultQueryError>(
    [apiRoutes.promotion.getLineByParentId, promotionId],
    () => getPromotionLinesFn(promotionId),
    opts
  );
