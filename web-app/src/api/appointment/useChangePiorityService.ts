import { getCookie } from 'src/lib/cookies';
import httpClient from 'src/lib/httpClient';
import apiRoutes from 'src/lib/apiRoutes';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DefaultQueryError } from '../type';

interface UpdatePiorityServiceFn {
  appointmentId: string;
  items: { serviceId: string }[];
}

export const inProgressAppointment = async (data: UpdatePiorityServiceFn) => {
  const token = getCookie('accessToken');
  const response = await httpClient.put(
    apiRoutes.appointment.changePiorityService(data.appointmentId),
    { items: data.items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const useInProgressAppointment = (
  options?: UseMutationOptions<any, DefaultQueryError, UpdatePiorityServiceFn>
) => {
  return useMutation<any, DefaultQueryError, UpdatePiorityServiceFn>(
    inProgressAppointment,
    options
  );
};
