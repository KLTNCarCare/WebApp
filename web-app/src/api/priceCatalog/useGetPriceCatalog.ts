import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

export interface GetPriceCatalogParams {
  page: number;
  limit: number;
}
export interface PriceCatalogResponse {
  data: PriceCatalogManagement[];
  totalPage: number;
}
export interface PriceCatalogManagement {
  _id: string;
  priceId: string;
  priceName: string;
  startDate: string;
  endDate: string;
  status: 'inactive' | 'active' | 'expires';
  items: Item[];
  createdDate: string;
  updatedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Item {
  itemId: string;
  itemName: string;
  price: number;
  _id: string;
}

export const getListPriceCatalogFn = async (params: GetPriceCatalogParams) => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<PriceCatalogResponse>(
    apiRoutes.priceCatalog.list,
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetListPriceCatalog = (
  params: GetPriceCatalogParams,
  opts?: UseQueryOptions<PriceCatalogResponse, DefaultQueryError>
) =>
  useQuery<PriceCatalogResponse, DefaultQueryError>(
    [apiRoutes.priceCatalog.list, params],
    () => getListPriceCatalogFn(params),
    opts
  );
