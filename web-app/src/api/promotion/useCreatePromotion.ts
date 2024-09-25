import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { CreatePromotionFn, Promotion } from './types';
export const createPromotionFn = async (
  data: CreatePromotionFn
): Promise<Promotion> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<Promotion>(
    apiRoutes.promotion.create,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCreatePromotion = (
  opts?: UseMutationOptions<Promotion, DefaultQueryError, CreatePromotionFn>
) =>
  useMutation<Promotion, DefaultQueryError, CreatePromotionFn>(
    (data) => createPromotionFn(data),
    opts
  );
