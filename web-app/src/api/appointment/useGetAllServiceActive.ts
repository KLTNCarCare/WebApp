import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import apiRoutes from 'src/lib/apiRoutes';

type ItemGetCurent = {
  itemId: string;
  itemName: string;
  categoryId: string;
  categoryName: string;
  duration: number;
};
interface ApiResponse {
  message: string;
  data: ItemGetCurent[];
}

export const getCurrentServiceActiveFn = async (): Promise<ItemGetCurent[]> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<ApiResponse>(
    apiRoutes.priceCatalog.getCurrent,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.data;
};

export const useGetCurrentServiceActive = (
  options?: UseQueryOptions<ItemGetCurent[], DefaultQueryError>
) => {
  return useQuery<ItemGetCurent[], DefaultQueryError>(
    ['currentServiceActive'],
    getCurrentServiceActiveFn,
    options
  );
};
