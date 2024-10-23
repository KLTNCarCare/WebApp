import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { CreatePromotionLineFn } from './types';
import { PromotionLine } from './useGetPromotionLine';

export const createPromotionLineFn = async (
  data: CreatePromotionLineFn
): Promise<PromotionLine> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<PromotionLine>(
    apiRoutes.promotionLine.create,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const useCreatePromotionLine = (
  opts?: UseMutationOptions<
    PromotionLine,
    DefaultQueryError,
    CreatePromotionLineFn
  >
) =>
  useMutation<PromotionLine, DefaultQueryError, CreatePromotionLineFn>(
    (data) => createPromotionLineFn(data),
    opts
  );
