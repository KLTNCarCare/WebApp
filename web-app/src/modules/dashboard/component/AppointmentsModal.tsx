import React, { useState, useEffect } from 'react';
import { Box, Modal, Button } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { cyan, green, grey, lightGreen, red } from '@mui/material/colors';

interface AppointmentsModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: any;
  appointments: any[];
  refetch: () => void;
}

const AppointmentsModal: React.FC<AppointmentsModalProps> = ({
  open,
  onClose,
  selectedDate,
  appointments,
  refetch,
}) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      setPaginationModel({ pageSize: 10, page: 0 });
    }
  }, [open]);

  const filteredAppointments = appointments.filter((item) =>
    dayjs(item.startTime).isSame(selectedDate, 'day')
  );

  const columns: GridColDef[] = [
    {
      field: 'customerName',
      headerName: t('priceCatalog.customerName'),
      width: 150,
    },
    {
      field: 'customerPhone',
      headerName: t('priceCatalog.customerPhone'),
      width: 150,
    },
    {
      field: 'vehicleLicensePlate',
      headerName: t('priceCatalog.vehicleLicensePlate'),
      width: 150,
    },
    {
      field: 'vehicleModel',
      headerName: t('priceCatalog.vehicleModel'),
      width: 150,
    },
    {
      field: 'totalDuration',
      headerName: t('priceCatalog.totalDuration'),
      width: 150,
    },
    {
      field: 'startTime',
      headerName: t('dashboard.startTime'),
      width: 150,
      valueGetter: (params) => dayjs(params.value).format('HH:mm DD-MM-YYYY'),
    },
    {
      field: 'endTime',
      headerName: t('dashboard.endTime'),
      width: 150,
      valueGetter: (params) => dayjs(params.value).format('HH:mm DD-MM-YYYY'),
    },
    { field: 'notes', headerName: t('priceCatalog.notes'), width: 200 },
    { field: 'status', headerName: t('priceCatalog.status'), width: 120 },
  ];

  const rows = filteredAppointments.map((appointment) => ({
    id: appointment._id,
    customerName: appointment.customer.name,
    customerPhone: appointment.customer.phone,
    vehicleLicensePlate: appointment.vehicle.licensePlate,
    vehicleModel: appointment.vehicle.model,
    totalDuration: appointment.total_duration,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    notes: appointment.notes,
    status: appointment.status,
  }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: '#fff',
          borderRadius: 1,
          width: '80%',
          margin: 'auto',
          mt: 5,
        }}
      >
        <h2>
          {t('dashboard.appointmentsFor')} {selectedDate.format('YYYY-MM-DD')}
        </h2>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            getRowId={(row) => row.id}
            getRowClassName={(params) => `status-${params.row.status}`}
            sx={{
              '& .status-missed': { backgroundColor: grey[300] },
              '& .status-pending': { backgroundColor: cyan[300] },
              '& .status-in-progress': { backgroundColor: lightGreen[300] },
              '& .status-completed': { backgroundColor: green[700] },
              '& .status-canceled': { backgroundColor: red[700] },
            }}
          />
        </div>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default AppointmentsModal;
