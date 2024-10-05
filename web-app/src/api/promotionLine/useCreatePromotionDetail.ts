import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { CreatePromotionDetailFn } from './types';

export const createPromotionDetail = async (data: CreatePromotionDetailFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.promotionDetail.create(data._id),
    new URLSearchParams({
      discount: data.discount.toString(),
      limitDiscount: data.limitDiscount.toString(),
      bill: data.bill.toString(),
    }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCreatePromotionDetail = (
  opts?: UseMutationOptions<void, DefaultQueryError, CreatePromotionDetailFn>
) =>
  useMutation<void, DefaultQueryError, CreatePromotionDetailFn>(
    (data) => createPromotionDetail(data),
    opts
  );
