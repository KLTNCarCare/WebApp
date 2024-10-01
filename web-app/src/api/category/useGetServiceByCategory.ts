import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export interface ServiceByCategory {
  [x: string]: any;
  _id: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  status: string;
  description: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getServiceByCategoryFn = async (
  categoryId: string
): Promise<ServiceByCategory[]> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<ServiceByCategory[]>(
    `${apiRoutes.category.getServiceByCategory}/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetServiceByCategory = (
  categoryId: string,
  opts?: UseQueryOptions<ServiceByCategory[], DefaultQueryError>
) =>
  useQuery<ServiceByCategory[], DefaultQueryError>(
    [apiRoutes.category.getServiceByCategory, categoryId],
    () => getServiceByCategoryFn(categoryId),
    opts
  );
