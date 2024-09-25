import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DeletePromotionFn } from './types';
import { getCookie } from 'src/lib/cookies';

export const deletePromotion = async (data: DeletePromotionFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.promotion.delete(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeletePromotion = (
  opts?: UseMutationOptions<void, DefaultQueryError, DeletePromotionFn>
) =>
  useMutation<void, DefaultQueryError, DeletePromotionFn>(
    (data) => deletePromotion(data),
    opts
  );
