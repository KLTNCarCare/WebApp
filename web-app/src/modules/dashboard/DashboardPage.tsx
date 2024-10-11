import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Popover,
  IconButton,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Check as CheckIcon, Done } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AdminLayout from 'src/components/layouts/AdminLayout';
import { useGetAppointmentInDay } from 'src/api/appointment/useGetAppointmentInDay';
import { Appointment } from 'src/api/appointment/types';
import CreateAppointmentModal from './component/CreateAppoimentModal';
import { useConfirmAppointment } from 'src/api/appointment/useConfirmAppointment';
import { useInProgressAppointment } from 'src/api/appointment/useInProgressAppoinment';
import { useCompletedAppointment } from 'src/api/appointment/useCompletedAppointment';
import { useCreateInvoice } from 'src/api/invoice/useCreateInvoice';
import { useGetInvoiceByAppoinment } from 'src/api/invoice/useGetInvoiceByAppoinment';
import InvoiceDetailModal from './component/InvoiceDetailModal';
import { Invoice } from 'src/api/invoice/types';
import useSocket from 'src/lib/socket';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers';
import AppointmentsModal from './component/AppointmentsModal';
import dayjs from 'dayjs';
import { cyan, green, grey, lightGreen } from '@mui/material/colors';
import { format } from 'date-fns';

interface Slot {
  id: string;
  title: string;
  items: Appointment[];
}

const initialSlots: Slot[] = [
  { id: 'slot-1', title: '', items: [] },
  { id: 'slot-2', title: '', items: [] },
  { id: 'slot-3', title: '', items: [] },
  { id: 'slot-4', title: '', items: [] },
  { id: 'slot-5', title: '', items: [] },
  { id: 'slot-6', title: '', items: [] },
];

const ItemTypes = {
  APPOINTMENT: 'appointment',
};

interface DraggableAppointmentProps {
  item: Appointment;
  refetch: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

const DraggableAppointment: React.FC<DraggableAppointmentProps> = ({
  item,
  refetch,
  onInvoiceCreated,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const { mutate: confirmAppointment, isLoading } = useConfirmAppointment();
  const { mutate: inProgressAppointment, isLoading: isInProgress } =
    useInProgressAppointment();
  const { mutate: completedAppointment, isLoading: isCompleting } =
    useCompletedAppointment();
  const { mutate: createInvoice, isLoading: isCreatingInvoice } =
    useCreateInvoice({
      onSuccess: (data) => {
        onInvoiceCreated(data);
      },
      onError: (error) => {},
    });

  const { t } = useTranslation();

  const { data: invoiceData } = useGetInvoiceByAppoinment(
    { appointmentId: item._id },
    {
      enabled: invoiceModalOpen,
      onSuccess: (data) => {
        if (data) {
          setSelectedInvoice(data);
          setIsLoadingInvoice(false);
        }
      },
      onError: () => {
        setIsLoadingInvoice(false);
      },
    }
  );

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleConfirm = () => {
    confirmAppointment(
      { _id: item._id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleInProgress = () => {
    inProgressAppointment(
      { _id: item._id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleComplete = () => {
    completedAppointment(
      { _id: item._id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handlePayment = () => {
    createInvoice({
      appointmentId: item._id,
    });
  };

  const handleViewInvoice = () => {
    setIsLoadingInvoice(true);
    setInvoiceModalOpen(true);
  };

  const open = Boolean(anchorEl);
  const [, ref] = useDrag({
    type: ItemTypes.APPOINTMENT,
    item: { id: item._id },
    canDrag: item.status === 'confirmed',
  });
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, 'HH:mm dd/MM/yyyy');
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'missed':
        return grey[300];
      case 'pending':
        return cyan[300];
      case 'in-progress':
        return lightGreen[300];
      case 'completed':
        return green[700];
      default:
        return '#fff';
    }
  };

  return (
    <>
      <Paper
        ref={ref}
        sx={{
          marginBottom: 3,
          padding: 3,
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
          maxWidth: 400,
          backgroundColor: getBackgroundColor(item.status),
          '&:hover': {
            boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: '1.3rem',
              mb: 1,
            }}
          >
            {item.customer.name}
          </Typography>
          <Typography sx={{ color: '#555', fontSize: '1rem', mb: 0.5 }}>
            {t('dashboard.phone')}: : {item.customer.phone}
          </Typography>
          <Typography sx={{ color: '#777', fontSize: '0.95rem' }}>
            {t('dashboard.services')}:{' '}
            {item.items.map((service: any) => service.serviceName).join(', ')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {item.status === 'pending' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleConfirm}
              disabled={isLoading}
              sx={{ fontSize: '0.9rem', flex: 1, mr: 1.5 }}
            >
              {isLoading ? t('dashboard.confirming') : t('dashboard.confirm')}
            </Button>
          )}
          {item.status === 'in-progress' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Done />}
              onClick={handleComplete}
              disabled={isCompleting}
              sx={{ fontSize: '0.9rem', flex: 1, mr: 1.5 }}
            >
              {isCompleting
                ? t('dashboard.completing')
                : t('dashboard.complete')}
            </Button>
          )}
          {item.invoiceCreated ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewInvoice}
              disabled={isLoadingInvoice}
              sx={{ fontSize: '0.9rem', flex: 1 }}
            >
              {isLoadingInvoice
                ? t('dashboard.loadingInvoice')
                : t('dashboard.viewInvoice')}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              disabled={isCreatingInvoice}
              sx={{ fontSize: '0.9rem', flex: 1 }}
            >
              {isCreatingInvoice
                ? t('dashboard.creatingInvoice')
                : t('dashboard.createInvoice')}
            </Button>
          )}
        </Box>
      </Paper>

      <Popover
        sx={{
          pointerEvents: 'none',
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.startTime')}: {formatDateTime(item.startTime)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.endTime')}: {formatDateTime(item.endTime)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.notes')}: {item.notes}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.invoiceCreated')}:{' '}
            {item.invoiceCreated ? t('dashboard.yes') : t('dashboard.no')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.licensePlate')}:{' '}
            {item.vehicle.licensePlate ?? t('dashboard.na')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.vehicleModel')}:{' '}
            {item.vehicle.model ?? t('dashboard.na')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.totalDuration')}: {item.total_duration}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.status')}: {t(`status.${item.status}`)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('dashboard.createdAt')}: : {formatDateTime(item.createdAt)}
          </Typography>
        </Box>
      </Popover>

      {selectedInvoice && (
        <InvoiceDetailModal
          open={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          invoiceData={selectedInvoice}
          refetch={refetch}
          dataInvoice={selectedInvoice}
          isLoadingInvoice={isLoadingInvoice}
          paginationModel={{ pageSize: 5, page: 0 }}
          setPaginationModel={() => {}}
        />
      )}
    </>
  );
};

interface DroppableSlotProps {
  slot: Slot;
  moveAppointment: (appointmentId: string, targetSlotId: string) => void;
  refetch: () => void;
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({
  slot,
  moveAppointment,
  refetch,
}) => {
  const { t } = useTranslation();
  const { mutate: inProgressAppointment } = useInProgressAppointment();

  const [, ref] = useDrop({
    accept: ItemTypes.APPOINTMENT,
    drop: (draggedItem: { id: string }) => {
      moveAppointment(draggedItem.id, slot.id);
      inProgressAppointment(
        { _id: draggedItem.id },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    },
  });

  return (
    <Box
      ref={ref}
      sx={{
        width: { xs: '100%', md: '48%' },
        minHeight: 200,
        padding: 2,
        marginBottom: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 0 }}>
        {slot.title}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        {slot.items.length > 0 ? (
          slot.items.map((item) => (
            <DraggableAppointment
              key={item._id}
              item={item}
              refetch={refetch}
              onInvoiceCreated={(invoice: Invoice) => {}}
            />
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#777', marginTop: 1 }}>
            {t('dashboard.noAppointmentsAvailable')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export function DashboardPage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [isAddAppointment, setIsAddAppointment] = useState<boolean>(false);
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      slots: initialSlots.map((slot, index) => ({
        ...slot,
        title: t(`slot.title${index + 1}`),
      })),
    }));
  }, [t]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: appointments, refetch: refetchAppointments } =
    useGetAppointmentInDay({ date: selectedDate.valueOf().toString() });

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    if (!dayjs(date).isSame(dayjs(), 'day')) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    refetchAppointments();
  };

  const handleAppointmentsModalClose = () => {
    setIsModalOpen(false);
  };

  const filteredAppointments =
    appointments?.filter(
      (item) =>
        item.status !== 'in-progress' &&
        item.status !== 'completed' &&
        dayjs(item.startTime).isSame(selectedDate, 'day')
    ) || [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const unixTimestamp = Math.floor(startOfToday.getTime());

  const { data, error, isLoading, refetch } = useGetAppointmentInDay({
    date: unixTimestamp.toString(),
  });

  const [state, setState] = useState<{
    appointments: Appointment[];
    slots: Slot[];
  }>({
    appointments: [],
    slots: initialSlots,
  });

  const { messages, sendMessage } = useSocket('user-id');

  useEffect(() => {
    if (data) {
      const appointments = data.map((appointment) => ({
        ...appointment,
        services: appointment.items.map((item) => item.serviceName),
        color:
          appointment.status === 'missed'
            ? grey[300]
            : appointment.status === 'pending'
            ? cyan[300]
            : appointment.status === 'in-progress'
            ? lightGreen[300]
            : appointment.status === 'completed'
            ? green[700]
            : undefined,
      }));

      const inProgressAppointments = appointments.filter(
        (appointment) => appointment.status === 'in-progress'
      );

      const updatedSlots = initialSlots.map((slot, index) => ({
        ...slot,
        items: inProgressAppointments.slice(index, index + 1),
      }));

      setState((prevState) => ({
        ...prevState,
        appointments: appointments.filter(
          (appointment) =>
            appointment.status === 'pending' ||
            appointment.status === 'missed' ||
            appointment.status === 'confirmed' ||
            appointment.status === 'completed'
        ),
        slots: updatedSlots,
      }));
    }
  }, [data, t]);

  useEffect(() => {
    const messageTypesToRefetch = [
      'PAID-INVOICE',
      'CANCELED-APPOINTMENT',
      'SAVE-APPOINTMENT',
      'CREATED-INVOICE-APPPOINTMENT',
      'MISSED-APPOINTMENT',
      'CONFIRMED-APPOINTMENT',
      'IN-PROGRESS-APPOINTMENT',
      'COMPLETED-APPOINTMENT',
    ];

    if (
      messages.some((message: any) =>
        messageTypesToRefetch.includes(message.mess_type)
      )
    ) {
      refetch();
    }
  }, [messages, refetch]);

  const moveAppointment = (appointmentId: string, targetSlotId: string) => {
    const sourceSlot = state.slots.find((slot) =>
      slot.items.some((item) => item._id === appointmentId)
    );

    const appointment = state.appointments.find(
      (item) => item._id === appointmentId
    );

    if (!appointment) return;

    const targetSlot = state.slots.find((slot) => slot.id === targetSlotId);

    if (!targetSlot || targetSlot.items.length > 0) return;

    if (sourceSlot) {
      setState((prevState) => ({
        ...prevState,
        slots: prevState.slots.map((slot) => {
          if (slot.id === sourceSlot.id) {
            return {
              ...slot,
              items: slot.items.filter((item) => item._id !== appointmentId),
            };
          }
          if (slot.id === targetSlotId) {
            return {
              ...slot,
              items: [...slot.items, appointment],
            };
          }
          return slot;
        }),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        appointments: prevState.appointments.filter(
          (item) => item._id !== appointmentId
        ),
        slots: prevState.slots.map((slot) => {
          if (slot.id === targetSlotId) {
            return {
              ...slot,
              items: [...slot.items, appointment],
            };
          }
          return slot;
        }),
      }));
    }
  };

  const handleAddAppointment = () => {
    setIsAddAppointment(true);
  };

  const handleCloseModal = () => {
    setIsAddAppointment(false);
    refetch();
  };

  const handleInvoiceCreated = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleInvoiceModalClose = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <AdminLayout
      title="Card Dashboard"
      isCollapse={isCollapse}
      setIsCollapse={setIsCollapse}
    >
      {isLoading ? (
        <Typography variant="h6" sx={{ padding: 2 }}>
          {t('dashboard.loadingData')}
        </Typography>
      ) : error ? (
        <Typography variant="h6" sx={{ color: 'red', padding: 2 }}>
          {t('dashboard.errorOccurred')}: {error.message}{' '}
        </Typography>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Grid container spacing={3} sx={{ padding: 2 }}>
            {/* Slot Area */}
            <Grid item xs={12} md={8}>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                height="75vh"
                overflow="auto"
                sx={{
                  padding: 2,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                {state.slots.map((slot) => (
                  <DroppableSlot
                    key={slot.id}
                    slot={slot}
                    moveAppointment={moveAppointment}
                    refetch={refetch}
                  />
                ))}
              </Box>
            </Grid>

            {/* Appointment List Area */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: '#f0f0f0',
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
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDateChange}
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
                  />
                  <IconButton
                    color="primary"
                    onClick={handleAddAppointment}
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
                  {state.appointments
                    .filter(
                      (item) =>
                        item.status !== 'in-progress' &&
                        item.status !== 'completed'
                    )
                    .map((item) => (
                      <DraggableAppointment
                        key={item._id}
                        item={item}
                        refetch={refetch}
                        onInvoiceCreated={handleInvoiceCreated}
                      />
                    ))}
                </Box>
              </Box>
            </Grid>

            {/* Completed Appointments Area */}
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 2,
                  boxShadow: 2,
                  marginTop: 4,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  {t('dashboard.completedAppointments')}
                </Typography>

                {state.appointments
                  .filter((item) => item.status === 'completed')
                  .map((item) => (
                    <DraggableAppointment
                      key={item._id}
                      item={item}
                      refetch={refetch}
                      onInvoiceCreated={handleInvoiceCreated}
                    />
                  ))}
              </Box>
            </Grid>
          </Grid>

          <CreateAppointmentModal
            open={isAddAppointment}
            onClose={handleCloseModal}
            refetch={refetch}
            setIsAddAppointment={setIsAddAppointment}
          />

          {selectedInvoice && (
            <InvoiceDetailModal
              open={isInvoiceModalOpen}
              onClose={() => {
                handleInvoiceModalClose();
                setIsInvoiceModalOpen(false);
                setSelectedInvoice(null);
              }}
              invoiceData={selectedInvoice}
              refetch={refetch}
              dataInvoice={null}
              isLoadingInvoice={false}
              paginationModel={{ pageSize: 10, page: 0 }}
              setPaginationModel={() => {}}
            />
          )}

          <AppointmentsModal
            open={isModalOpen}
            onClose={handleAppointmentsModalClose}
            selectedDate={selectedDate}
            appointments={appointments || []}
            refetch={refetchAppointments}
          />
        </DndProvider>
      )}
    </AdminLayout>
  );
}
