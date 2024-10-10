import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { CompletedAppointmentFn } from './types';

export const completedAppointment = async (data: CompletedAppointmentFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.appointment.completed(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCompletedAppointment = (
  opts?: UseMutationOptions<void, DefaultQueryError, CompletedAppointmentFn>
) =>
  useMutation<void, DefaultQueryError, CompletedAppointmentFn>(
    (data) => completedAppointment(data),
    opts
  );
