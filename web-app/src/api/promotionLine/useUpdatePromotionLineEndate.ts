import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { PromotionLine, UpdateEndatePromotionLineFn } from './types';

export const updateEndatePromotionLineFn = async (
  id: string,
  data: UpdateEndatePromotionLineFn
) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<PromotionLine>(
    `${apiRoutes.promotionLine.updateEndDate}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdateEndatePromotionLine = (
  opts?: UseMutationOptions<
    PromotionLine,
    DefaultQueryError,
    { id: string; data: UpdateEndatePromotionLineFn }
  >
) =>
  useMutation<
    PromotionLine,
    DefaultQueryError,
    { id: string; data: UpdateEndatePromotionLineFn }
  >(({ id, data }) => updateEndatePromotionLineFn(id, data), opts);
