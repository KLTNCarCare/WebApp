import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { Appointment, CreateAppointmentFn } from './types';

export const createAppointmentFutureWithSkipCondFn = async (
  data: CreateAppointmentFn
): Promise<Appointment> => {
  const token = getCookie('accessToken');
  const url = `${apiRoutes.appointment.createOnSiteFuture}?skipCond=true`;
  const response = await httpClient.post<Appointment>(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useCreateAppointmentFutureWithSkipCond = (
  opts?: UseMutationOptions<Appointment, DefaultQueryError, CreateAppointmentFn>
) =>
  useMutation<Appointment, DefaultQueryError, CreateAppointmentFn>(
    createAppointmentFutureWithSkipCondFn,
    opts
  );
