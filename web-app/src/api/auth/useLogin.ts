import apiRoutes from '../../lib/apiRoutes';
import httpClient from '../../lib/httpClient';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    username: string;
    role: string;
  };
  message: string;
  statusCode: number;
}

export const loginFn = async (body: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>(
    apiRoutes.admin.auth.login,
    body
  );
  return response.data;
};

export const useLogin = (
  opts?: UseMutationOptions<
    LoginResponse,
    DefaultQueryError,
    { username: string; password: string }
  >
) =>
  useMutation<
    LoginResponse,
    DefaultQueryError,
    { username: string; password: string }
  >([apiRoutes.admin.auth.login], loginFn, opts);
