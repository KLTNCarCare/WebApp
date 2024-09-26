import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Category, UpdateCategoryFn } from './types';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export const updateCategoryFn = async (id: string, data: UpdateCategoryFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put<Category>(
    `${apiRoutes.category.update}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdateCategory = (
  opts?: UseMutationOptions<
    Category,
    DefaultQueryError,
    { id: string; data: UpdateCategoryFn }
  >
) =>
  useMutation<
    Category,
    DefaultQueryError,
    { id: string; data: UpdateCategoryFn }
  >(({ id, data }) => updateCategoryFn(id, data), opts);
