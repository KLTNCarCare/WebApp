import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiRoutes from 'src/lib/apiRoutes';
import httpClient from 'src/lib/httpClient';
import { DefaultQueryError } from '../type';
import { getCookie } from 'src/lib/cookies';
import { Appointment } from './types';

export interface GetAppointmentInDayParams {
  date: string;
}

export const getAppointmentInDayFn = async (): Promise<Appointment[]> => {
  const token = getCookie('accessToken');
  const response = await httpClient.get<Appointment[]>(
    apiRoutes.appointment.getAppointmentInDay,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};

export const useGetAppointmentInDay = (
  params: GetAppointmentInDayParams,
  options?: UseQueryOptions<Appointment[], DefaultQueryError>
) => {
  return useQuery<Appointment[], DefaultQueryError>(
    ['appointments', params],
    () => getAppointmentInDayFn(),
    options
  );
};
