import React from 'react';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

interface CustomDayProps {
  day: Dayjs;
  selectedDate: Dayjs[];
  pickersDayProps: PickersDayProps<Dayjs>;
  appointments: any[];
}

const CustomDay: React.FC<CustomDayProps> = ({
  day,
  selectedDate,
  pickersDayProps,
  appointments,
}) => {
  const hasPendingAppointments = (date: Dayjs) => {
    return appointments.some(
      (appointment) =>
        dayjs(appointment.startTime).isSame(date, 'day') &&
        appointment.status === 'pending'
    );
  };

  const isPastDate = (date: Dayjs) => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  const isPending = hasPendingAppointments(day);
  const isPast = isPastDate(day);

  return (
    <PickersDay
      {...pickersDayProps}
      sx={{
        backgroundColor: isPending ? 'yellow' : undefined,
        color: isPast ? 'gray' : undefined,
        position: 'relative',
      }}
    >
      {day.format('D')}
      {isPending && (
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'red',
          }}
        />
      )}
    </PickersDay>
  );
};

export default CustomDay;
