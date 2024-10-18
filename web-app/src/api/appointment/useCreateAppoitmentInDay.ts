import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { Appointment, CreateAppointmentFn } from './types';

export const createAppointmentFn = async (
  data: CreateAppointmentFn
): Promise<Appointment> => {
  const token = getCookie('accessToken');
  const response = await httpClient.post<Appointment>(
    apiRoutes.appointment.createOnSite,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useCreateAppointment = (
  opts?: UseMutationOptions<Appointment, DefaultQueryError, CreateAppointmentFn>
) =>
  useMutation<Appointment, DefaultQueryError, CreateAppointmentFn>(
    (data) => createAppointmentFn(data),
    opts
  );
