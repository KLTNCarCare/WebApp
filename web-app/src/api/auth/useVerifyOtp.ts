import apiRoutes from '../../lib/apiRoutes';
import httpClient from '../../lib/httpClient';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import { OtpFormValues } from './types';

export const verifyOtpFn = async (body: OtpFormValues) => {
  const response = await httpClient.post<{ status: string }>(
    apiRoutes.admin.auth.verifyOtp,
    body
  );
  return response.data;
};

export const useVerifyOtp = (
  opts?: UseMutationOptions<
    { status: string },
    DefaultQueryError,
    OtpFormValues
  >
) =>
  useMutation<{ status: string }, DefaultQueryError, OtpFormValues>(
    [apiRoutes.admin.auth.verifyOtp],
    verifyOtpFn,
    opts
  );
