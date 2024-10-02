import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export interface PromotionLine {
  _id: string;
  lineId: string;
  parentId: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  itemId: string;
  itemGiftId: string;
  discount: number;
  limitDiscount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [x: string]: any;
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
