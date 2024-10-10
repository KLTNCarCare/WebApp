import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { getCookie } from 'src/lib/cookies';
import { InProgressAppointmentFn } from './types';

export const inProgressAppointment = async (data: InProgressAppointmentFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.appointment.inprogress(data._id),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useInProgressAppointment = (
  opts?: UseMutationOptions<void, DefaultQueryError, InProgressAppointmentFn>
) =>
  useMutation<void, DefaultQueryError, InProgressAppointmentFn>(
    (data) => inProgressAppointment(data),
    opts
  );
