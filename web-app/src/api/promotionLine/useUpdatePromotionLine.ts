import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { UpdatePromotionLineFn } from './types';
import { PromotionLine } from './useGetPromotionLine';

export const updatePromotionLineFn = async (
  data: UpdatePromotionLineFn
): Promise<PromotionLine> => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<PromotionLine>(
    `${apiRoutes.promotionLine.update}/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdatePromotionLine = (
  opts?: UseMutationOptions<
    PromotionLine,
    DefaultQueryError,
    UpdatePromotionLineFn
  >
) =>
  useMutation<PromotionLine, DefaultQueryError, UpdatePromotionLineFn>(
    (data) => updatePromotionLineFn(data),
    opts
  );
