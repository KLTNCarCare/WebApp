import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import apiRoutes from 'src/lib/apiRoutes';
import { ChangePasswordParams, ChangePasswordResponse } from './types';

const changePasswordAPI = async (
  params: ChangePasswordParams
): Promise<ChangePasswordResponse> => {
  const { phoneNumber, oldPass, newPass, otp } = params;
  const response = await axios.post<ChangePasswordResponse>(
    `${apiRoutes.account.changePassword}/${phoneNumber}`,
    new URLSearchParams({
      oldPass,
      newPass,
      otp,
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

export const useChangePassword = (
  options?: UseMutationOptions<
    ChangePasswordResponse,
    Error,
    ChangePasswordParams
  >
) => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordParams>(
    changePasswordAPI,
    options
  );
};
