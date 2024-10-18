import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { CanceledAppointmentFn } from './types';

export const canceledAppointment = async (data: CanceledAppointmentFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.appointment.cancel(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCanceledAppointment = (
  opts?: UseMutationOptions<void, DefaultQueryError, CanceledAppointmentFn>
) =>
  useMutation<void, DefaultQueryError, CanceledAppointmentFn>(
    (data) => canceledAppointment(data),
    opts
  );
