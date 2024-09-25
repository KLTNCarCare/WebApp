import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';

export interface DeleteUser {
  _id: string;
}
export const deleteAccountByAdminFn = async ({ _id }: DeleteUser) => {
  const response = await httpClient.delete<{ status: string }>(
    apiRoutes.employee.delete(_id)
  );
  return response.data;
};

export const useDeleteAccountByAdmin = (
  opts?: UseMutationOptions<{ status: string }, DefaultQueryError, DeleteUser>
) =>
  useMutation<{ status: string }, DefaultQueryError, DeleteUser>(
    [apiRoutes.employee.delete],
    (id) => deleteAccountByAdminFn(id),
    opts
  );
