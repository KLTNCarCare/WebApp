import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { CreateCategoryFn, Category } from './types';
export const createCategoryFn = async (
  data: CreateCategoryFn
): Promise<Category> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<Category>(
    apiRoutes.category.create,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCreateCategory = (
  opts?: UseMutationOptions<Category, DefaultQueryError, CreateCategoryFn>
) =>
  useMutation<Category, DefaultQueryError, CreateCategoryFn>(
    (data) => createCategoryFn(data),
    opts
  );
