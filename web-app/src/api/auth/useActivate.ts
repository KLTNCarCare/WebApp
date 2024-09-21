import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../../api/type';
import { ActivateArgs } from './types';

export const activateFn = async (body: ActivateArgs) => {
  const response = await httpClient.post<{ status: string }>(
    apiRoutes.admin.auth.activate,
    body
  );
  return response.data;
};

export const useActivate = (
  opts?: UseMutationOptions<{ status: string }, DefaultQueryError, ActivateArgs>
) =>
  useMutation<{ status: string }, DefaultQueryError, ActivateArgs>(
    [apiRoutes.admin.auth.activate],
    activateFn,
    opts
  );
