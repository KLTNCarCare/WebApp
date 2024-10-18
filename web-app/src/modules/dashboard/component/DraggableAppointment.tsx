import React, { useState } from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { Check as CheckIcon, Done, Cancel } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { cyan, green, grey, lightGreen } from '@mui/material/colors';
import { useConfirmAppointment } from 'src/api/appointment/useConfirmAppointment';
import { useInProgressAppointment } from 'src/api/appointment/useInProgressAppoinment';
import { useCompletedAppointment } from 'src/api/appointment/useCompletedAppointment';
import { useCreateInvoice } from 'src/api/invoice/useCreateInvoice';
import { useGetInvoiceByAppoinment } from 'src/api/invoice/useGetInvoiceByAppoinment';
import { useCanceledAppointment } from 'src/api/appointment/useCancelAppoitment';
import InvoiceDetailModal from './InvoiceDetailModal';
import AppointmentDetailModal from './detailModal/AppointmentDetailModal';
import PaymentModal from './PaymentModal';
import { Appointment } from 'src/api/appointment/types';
import { Invoice } from 'src/api/invoice/types';

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
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { mutate: confirmAppointment, isLoading } = useConfirmAppointment();
  const { mutate: inProgressAppointment, isLoading: isInProgress } =
    useInProgressAppointment();
  const { mutate: completedAppointment, isLoading: isCompleting } =
    useCompletedAppointment();
  const { mutate: createInvoice, isLoading: isCreatingInvoice } =
    useCreateInvoice({
      onSuccess: (data) => {
        onInvoiceCreated(data);
        setSelectedInvoice(data);
        setInvoiceModalOpen(true);
      },
      onError: (error) => {
        console.error('Invoice creation failed', error);
      },
    });
  const { mutate: cancelAppointment, isLoading: isCancelling } =
    useCanceledAppointment();

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

  const handleConfirm = () => {
    confirmAppointment(
      { _id: item._id },
      {
        onSuccess: () => {
          inProgressAppointment(
            { _id: item._id },
            {
              onSuccess: () => {
                refetch();
              },
            }
          );
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

  const handlePaymentAndInvoice = async (paymentMethod: string) => {
    try {
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // After payment is successful, create the invoice
      createInvoice({ appointmentId: item._id });
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Payment failed', error);
      // Handle payment failure (e.g., show an error message)
    }
  };

  const handleViewInvoice = () => {
    setIsLoadingInvoice(true);
    setInvoiceModalOpen(true);
  };

  const handleCancel = () => {
    cancelAppointment(
      { _id: item._id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleOpenDetailModal = () => {
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

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

  // Tính tổng giá trị của các dịch vụ trong lịch hẹn
  const totalPrice = item.items.reduce(
    (total: number, service: any) => total + service.price,
    0
  );

  return (
    <>
      <Paper
        ref={ref}
        sx={{
          marginBottom: 0,
          padding: 3,
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
          maxWidth: 400,
          backgroundColor: getBackgroundColor(item.status),
          '&:hover': {
            boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.15)',
          },
          flexShrink: 0,
          minWidth: '200px',
          overflow: 'hidden',
        }}
        onClick={handleOpenDetailModal}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: '1.2rem',
              mb: 1,
              backgroundColor: '#f0f0f0',
              padding: '0.3rem',
              borderRadius: '4px',
            }}
          >
            {item.customer.name}
          </Typography>
          <Typography
            sx={{
              color: '#555',
              fontSize: '1rem',
              mb: 0.5,
              backgroundColor: '#f0f0f0',
              padding: '0.3rem',
              borderRadius: '4px',
            }}
          >
            {t('dashboard.phone')}: {item.customer.phone}
          </Typography>
          <Typography
            sx={{
              color: '#777',
              fontSize: '0.95rem',
              backgroundColor: '#f0f0f0',
              padding: '0.3rem',
              borderRadius: '4px',
            }}
          >
            {t('dashboard.services')}:{' '}
            {item.items.map((service: any) => service.serviceName).join(', ')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {item.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm();
                }}
                disabled={isLoading}
                sx={{ fontSize: '0.9rem', flex: 1, mr: 1.5 }}
              >
                {isLoading ? t('dashboard.confirming') : t('dashboard.confirm')}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={isCancelling}
                sx={{ fontSize: '0.9rem', flex: 1 }}
              >
                {isCancelling
                  ? t('dashboard.cancelling')
                  : t('dashboard.cancel')}
              </Button>
            </>
          )}
          {item.status === 'in-progress' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Done />}
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              disabled={isCompleting}
              sx={{ fontSize: '0.9rem', flex: 1, mr: 1.5 }}
            >
              {isCompleting
                ? t('dashboard.completing')
                : t('dashboard.complete')}
            </Button>
          )}
          {item.status === 'completed' && !item.invoiceCreated && (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenPaymentModal();
              }}
              disabled={isCreatingInvoice}
              sx={{ fontSize: '0.9rem', flex: 1 }}
            >
              {isCreatingInvoice
                ? t('dashboard.creatingInvoice')
                : t('dashboard.payAndCreateInvoice')}
            </Button>
          )}
        </Box>
      </Paper>

      <AppointmentDetailModal
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        item={item}
        refetch={function (): void {
          throw new Error('Function not implemented.');
        }}
      />

      <PaymentModal
        open={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onSubmit={handlePaymentAndInvoice}
        invoiceAmount={totalPrice} // Sử dụng tổng giá trị đã tính toán
        appointmentId={item._id}
        customerName={item.customer.name}
        customerPhone={item.customer.phone}
        refetch={refetch}
      />

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

export default DraggableAppointment;
