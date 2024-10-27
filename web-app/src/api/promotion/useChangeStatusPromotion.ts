import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { ChangeStatusFn } from './types';
import { getCookie } from 'src/lib/cookies';

export const changeStatus = async (data: ChangeStatusFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.promotion.changeSTTLine(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useChangeStatus = (
  opts?: UseMutationOptions<void, DefaultQueryError, ChangeStatusFn>
) =>
  useMutation<void, DefaultQueryError, ChangeStatusFn>(
    (data) => changeStatus(data),
    opts
  );
