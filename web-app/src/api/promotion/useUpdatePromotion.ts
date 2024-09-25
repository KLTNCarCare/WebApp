import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Promotion, UpdatePromotionFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updatePromotionFn = async (
  id: string,
  data: UpdatePromotionFn
) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<Promotion>(
    `${apiRoutes.promotion.update}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    }
  );
  return response.data;
};

export const useUpdatePromotion = (
  opts?: UseMutationOptions<
    Promotion,
    DefaultQueryError,
    { id: string; data: UpdatePromotionFn }
  >
) =>
  useMutation<
    Promotion,
    DefaultQueryError,
    { id: string; data: UpdatePromotionFn }
  >(({ id, data }) => updatePromotionFn(id, data), opts);
