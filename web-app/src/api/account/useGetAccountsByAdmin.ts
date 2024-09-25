import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';

export interface GetAccountParams {
  page: number;
  size: number;
  email?: string;
  phone?: string;
}
export interface AccountResponse {
  data: AccountManagement[];
  status: string;
  total: number;
}
export interface AccountManagement {
  _id: string;
  name: string;
  email: string;
  create_time: number;
  userRoleId: string;
}

export const getListAccountByAdminFn = async (params: GetAccountParams) => {
  const response = await httpClient.get<AccountResponse>(
    apiRoutes.employee.list,
    {
      params,
    }
  );
  return response.data;
};

export const useGetListAccountByAdmin = (
  params: GetAccountParams,
  opts?: UseQueryOptions<AccountResponse, DefaultQueryError>
) =>
  useQuery<AccountResponse, DefaultQueryError>(
    [apiRoutes.employee.list],
    () => getListAccountByAdminFn(params),
    opts
  );
