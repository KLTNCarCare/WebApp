import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { DeletePromotionDetailFn } from './types';

export const deletePromotionDetail = async (data: DeletePromotionDetailFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.promotionDetail.delete(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeletePromotionDetail = (
  opts?: UseMutationOptions<void, DefaultQueryError, DeletePromotionDetailFn>
) =>
  useMutation<void, DefaultQueryError, DeletePromotionDetailFn>(
    (data) => deletePromotionDetail(data),
    opts
  );
