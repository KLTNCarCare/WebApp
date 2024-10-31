import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';

import { Appointment, CreateAppointmentFn } from './types';

export const createAppointmentFutureFn = async (
  data: CreateAppointmentFn,
  skipCond?: boolean
): Promise<Appointment> => {
  const token = getCookie('accessToken');
  const url = skipCond
    ? `${apiRoutes.appointment.createOnSiteFuture}?skipCond=true`
    : apiRoutes.appointment.createOnSiteFuture;
  const response = await httpClient.post<Appointment>(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useCreateAppointmentFuture = (
  opts?: UseMutationOptions<Appointment, DefaultQueryError, CreateAppointmentFn>
) =>
  useMutation<Appointment, DefaultQueryError, CreateAppointmentFn>(
    (data) => createAppointmentFutureFn(data, opts?.meta?.skipCond === true),
    opts
  );
