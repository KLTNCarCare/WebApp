import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { ConfirmAppointmentFn } from './types';

export const confirmAppointment = async (data: ConfirmAppointmentFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.appointment.confirm(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useConfirmAppointment = (
  opts?: UseMutationOptions<void, DefaultQueryError, ConfirmAppointmentFn>
) =>
  useMutation<void, DefaultQueryError, ConfirmAppointmentFn>(
    (data) => confirmAppointment(data),
    opts
  );
