import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { PromotionLine, UpdatePromotionLineFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updatePromotionLineFn = async (
  id: string,
  data: UpdatePromotionLineFn
) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<PromotionLine>(
    `${apiRoutes.promotionLine.update}/${id}`,
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
    { id: string; data: UpdatePromotionLineFn }
  >
) =>
  useMutation<
    PromotionLine,
    DefaultQueryError,
    { id: string; data: UpdatePromotionLineFn }
  >(({ id, data }) => updatePromotionLineFn(id, data), opts);
