import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AdminLayout from 'src/components/layouts/AdminLayout';
import LoadingState from './component/LoadingState';
import SlotArea from './component/SlotArea';
import AppointmentList from './component/AppointmentList';
import CompletedAppointments from './component/CompletedAppointments';
import CreateAppointmentModal from './component/CreateAppoimentModal';
import InvoiceDetailModal from './component/InvoiceDetailModal';
import AppointmentsModal from './component/AppointmentsModal';
import { useGetAppointmentInDay } from 'src/api/appointment/useGetAppointmentInDay';
import { useTranslation } from 'react-i18next';
import useSocket from 'src/lib/socket';
import { grey, cyan, lightGreen, green } from '@mui/material/colors';
import dayjs from 'dayjs';
import { format } from 'date-fns';

interface Slot {
  id: string;
  title: string;
  items: any[];
}

const initialSlots: Slot[] = [
  { id: 'slot-1', title: '', items: [] },
  { id: 'slot-2', title: '', items: [] },
  { id: 'slot-3', title: '', items: [] },
  { id: 'slot-4', title: '', items: [] },
  { id: 'slot-5', title: '', items: [] },
  { id: 'slot-6', title: '', items: [] },
];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState(false);
  const [isAddAppointment, setIsAddAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [state, setState] = useState<{ appointments: any[]; slots: Slot[] }>({
    appointments: [],
    slots: initialSlots,
  });

  const { data: appointments, refetch: refetchAppointments } =
    useGetAppointmentInDay({ date: selectedDate.valueOf().toString() });

  const { data, error, isLoading, refetch } = useGetAppointmentInDay({
    date: Math.floor(new Date().setHours(0, 0, 0, 0)).toString(),
  });

  const { messages } = useSocket('user-id');

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      slots: initialSlots.map((slot, index) => ({
        ...slot,
        title: t(`slot.title${index + 1}`),
      })),
    }));
  }, [t]);

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
            ? cyan[200]
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

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    if (!dayjs(date).isSame(dayjs(), 'day')) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    refetchAppointments();
  };

  const handleAddAppointment = () => {
    setIsAddAppointment(true);
  };

  const handleCloseModal = () => {
    setIsAddAppointment(false);
    refetch();
  };

  const handleInvoiceCreated = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleInvoiceModalClose = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleAppointmentsModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <AdminLayout
      title="Card Dashboard"
      isCollapse={isCollapse}
      setIsCollapse={setIsCollapse}
    >
      <LoadingState isLoading={isLoading} error={error} />
      {!isLoading && !error && (
        <DndProvider backend={HTML5Backend}>
          <Box
            display="flex"
            flexDirection="column"
            height="100vh"
            sx={{ padding: 2 }}
          >
            <Box display="flex" flex="1" minHeight="0">
              <Box
                flex={isCollapse ? '0 0 1000px' : '1'}
                minWidth={isCollapse ? '1000px' : '0'}
              >
                <SlotArea
                  slots={state.slots}
                  moveAppointment={moveAppointment}
                  refetch={refetch}
                />
              </Box>
              <Box width="400px" flexShrink="0">
                <AppointmentList
                  appointments={state.appointments}
                  selectedDate={selectedDate}
                  handleDateChange={handleDateChange}
                  handleAddAppointment={handleAddAppointment}
                  refetch={refetch}
                  handleInvoiceCreated={handleInvoiceCreated}
                />
              </Box>
            </Box>
            <Box flexShrink="0" marginTop={1}>
              <CompletedAppointments
                appointments={state.appointments}
                refetch={refetch}
                handleInvoiceCreated={handleInvoiceCreated}
              />
            </Box>
          </Box>

          <CreateAppointmentModal
            open={isAddAppointment}
            onClose={handleCloseModal}
            refetch={refetch}
            setIsAddAppointment={setIsAddAppointment}
          />

          {selectedInvoice && (
            <InvoiceDetailModal
              open={isInvoiceModalOpen}
              onClose={handleInvoiceModalClose}
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
};

export default DashboardPage;
