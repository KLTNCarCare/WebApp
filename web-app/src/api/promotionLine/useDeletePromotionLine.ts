import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { DeletePromotionLineFn } from './types';

export const deletePromotionLine = async (data: DeletePromotionLineFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.promotionLine.delete(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeletePromotionLine = (
  opts?: UseMutationOptions<void, DefaultQueryError, DeletePromotionLineFn>
) =>
  useMutation<void, DefaultQueryError, DeletePromotionLineFn>(
    (data) => deletePromotionLine(data),
    opts
  );
