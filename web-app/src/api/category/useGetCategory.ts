import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export interface GetCategoryParams {
  page: number;
  limit: number;
}

export interface CategoryResponse {
  data: CategoryManagement[];
  totalPage: number;
}

export interface CategoryManagement {
  _id: string;
  categoryId: string;
  categoryName: string;
  duration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getListCategoryFn = async (params: GetCategoryParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<CategoryResponse>(
    apiRoutes.category.list,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetListCategory = (
  params: GetCategoryParams,
  opts?: UseQueryOptions<CategoryResponse, DefaultQueryError>
) =>
  useQuery<CategoryResponse, DefaultQueryError>(
    [apiRoutes.category.list, params],
    () => getListCategoryFn(params),
    opts
  );
