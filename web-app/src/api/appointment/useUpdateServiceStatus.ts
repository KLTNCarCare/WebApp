import { getCookie } from 'src/lib/cookies';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';

interface UpdateServiceStatusFn {
  appointmentId: string;
  serviceId: string;
}

export const inProgressAppointment = async (data: UpdateServiceStatusFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.appointment.changeServiceStatus(
      data.appointmentId,
      data.serviceId
    ),
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
  opts?: UseMutationOptions<void, DefaultQueryError, UpdateServiceStatusFn>
) =>
  useMutation<void, DefaultQueryError, UpdateServiceStatusFn>(
    (data) => inProgressAppointment(data),
    opts
  );
