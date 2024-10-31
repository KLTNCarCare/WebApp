import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DatePicker, PickersDayProps } from '@mui/x-date-pickers';
import DraggableAppointment from './DraggableAppointment';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import CustomDay from './datePicker/CustomDay';
import CreateAppointmentFutureModal from './createAppointmentFuture/CreateAppoimentFutureModal';

interface Appointment {
  _id: string;
  appointmentId: string;
  customer: {
    phone: string;
    name: string;
  };
  vehicle: {
    licensePlate: string;
    model: string;
  };
  total_duration: number;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
  discount: {
    per: number;
    value_max: number;
  };
  promotion: any[];
  invoiceCreated: boolean;
  items: {
    typeId: string;
    typeName: string;
    serviceId: string;
    serviceName: string;
    price: number;
    discount: number;
    status: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AppointmentListProps {
  appointments: Appointment[];
  selectedDate: Dayjs | null;
  handleDateChange: (date: Dayjs | null) => void;
  handleAddAppointment: () => void;
  refetch: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  selectedDate,
  handleDateChange,
  handleAddAppointment,
  refetch,
}) => {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const renderDay = (
    day: Dayjs,
    selectedDate: Dayjs[],
    pickersDayProps: PickersDayProps<Dayjs>
  ) => {
    return (
      <CustomDay
        day={day}
        selectedDate={selectedDate}
        pickersDayProps={pickersDayProps}
        appointments={appointments}
      />
    );
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: '#d9fcf9',
        borderRadius: 2,
        boxShadow: 2,
        height: '75vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          backgroundColor: '#ffffff',
          padding: 1,
          borderRadius: 1,
          boxShadow: 1,
          flexWrap: 'nowrap',
          gap: 1,
        }}
        width="350px"
        flexShrink="0"
      >
        <Typography
          variant="h6"
          sx={{
            flex: '1 1 auto',
            minWidth: '150px',
            whiteSpace: 'nowrap',
          }}
        >
          {t('dashboard.appointments')}
        </Typography>
        {/* <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          renderDay={renderDay}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                flex: '1 1 auto',
                minWidth: '150px',
                maxWidth: '200px',
                whiteSpace: 'nowrap',
              }}
            />
          )}
        /> */}
        <IconButton
          color="primary"
          onClick={handleOpenCreateModal}
          sx={{ flex: '0 0 auto' }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        {appointments
          .filter(
            (item) =>
              item.status !== 'in-progress' && item.status !== 'completed'
          )
          .map((item, index) => (
            <React.Fragment key={item._id}>
              <DraggableAppointment item={item} refetch={refetch} />
              {index < appointments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
      </Box>

      <CreateAppointmentFutureModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        refetch={refetch}
      />
    </Box>
  );
};

export default AppointmentList;
