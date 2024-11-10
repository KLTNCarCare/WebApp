import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { SendOtpParams, SendOtpResponse } from './types';

const sendOtpAPI = async (params: SendOtpParams): Promise<SendOtpResponse> => {
  const { phoneNumber, recaptchaToken } = params;
  const response = await httpClient.post<SendOtpResponse>(
    apiRoutes.account.sendOTP,
    new URLSearchParams({
      phoneNumber,
      recaptchaToken,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};

export const useSendOtp = (
  options?: UseMutationOptions<SendOtpResponse, Error, SendOtpParams>
) => {
  return useMutation<SendOtpResponse, Error, SendOtpParams>(
    sendOtpAPI,
    options
  );
};
