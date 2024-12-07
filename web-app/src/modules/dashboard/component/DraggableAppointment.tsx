import React, { useState } from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { Check as CheckIcon, Cancel } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { purple, grey, green, cyan } from '@mui/material/colors';
import { useConfirmAppointment } from 'src/api/appointment/useConfirmAppointment';
import { useInProgressAppointment } from 'src/api/appointment/useInProgressAppoinment';
import { useCompletedAppointment } from 'src/api/appointment/useCompletedAppointment';
import { useCreateInvoice } from 'src/api/invoice/useCreateInvoice';
import { useCanceledAppointment } from 'src/api/appointment/useCancelAppoitment';
import AppointmentDetailModal from './detailModal/AppointmentDetailModal';
import PaymentModal from './PaymentModal';
import InvoiceDetailModal from 'src/modules/invoice/component/InvoiceDetailModal';
import { Appointment } from 'src/api/appointment/types';
import snackbarUtils from 'src/lib/snackbarUtils';
import { Invoice } from 'src/api/invoice/types';

const ItemTypes = {
  APPOINTMENT: 'appointment',
};

interface DraggableAppointmentProps {
  item: Appointment;
  refetch: () => void;
}

const DraggableAppointment: React.FC<DraggableAppointmentProps> = ({
  item,
  refetch,
}) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  const { mutate: confirmAppointment, isLoading } = useConfirmAppointment();
  const { mutate: inProgressAppointment, isLoading: isInProgress } =
    useInProgressAppointment();
  const { mutate: completedAppointment, isLoading: isCompleting } =
    useCompletedAppointment();
  const { mutate: createInvoice, isLoading: isCreatingInvoice } =
    useCreateInvoice({
      onSuccess: (invoice) => {
        snackbarUtils.success('Invoice created successfully');
        setSelectedInvoice(invoice);
      },
      onError: (error) => {
        console.error('Invoice creation failed', error);
        snackbarUtils.error('Invoice creation failed');
      },
    });
  const { mutate: cancelAppointment, isLoading: isCancelling } =
    useCanceledAppointment();
  const { t } = useTranslation();

  const handleConfirm = () => {
    confirmAppointment(
      { _id: item._id },
      {
        onSuccess: () =>
          inProgressAppointment({ _id: item._id }, { onSuccess: refetch }),
      }
    );
  };

  const handleInProgress = () =>
    inProgressAppointment({ _id: item._id }, { onSuccess: refetch });
  const handleComplete = () =>
    completedAppointment({ _id: item._id }, { onSuccess: refetch });
  const handlePaymentAndInvoice = async (paymentMethod: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      createInvoice({ appointmentId: item._id });
      setIsPaymentModalOpen(false);
      setIsInvoiceModalOpen(true);
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  const handleCancel = () =>
    cancelAppointment({ _id: item._id }, { onSuccess: refetch });
  const handleOpenDetailModal = () => setIsDetailModalOpen(true);
  const handleCloseDetailModal = () => setIsDetailModalOpen(false);
  const handleOpenPaymentModal = () => setIsPaymentModalOpen(true);
  const handleClosePaymentModal = () => setIsPaymentModalOpen(false);
  const handlePaymentSuccess = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
    setIsPaymentModalOpen(false);
  };
  const handleCloseInvoiceModal = () => setIsInvoiceModalOpen(false);

  const [, ref] = useDrag({
    type: ItemTypes.APPOINTMENT,
    item: { id: item._id },
    canDrag: item.status === 'confirmed' || item.status === 'pending',
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
        return purple[200];
      case 'in-progress':
        return green[200];
      case 'completed':
        return green[500];
      default:
        return '#fff';
    }
  };

  const totalPrice = item.items.reduce(
    (total: number, service: any) => total + service.price,
    0
  );

  return (
    <>
      <Paper
        ref={ref}
        sx={{
          marginBottom: 2,
          padding: 3,
          borderRadius: 3,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          transition: 'box-shadow 0.4s ease, transform 0.3s ease',
          maxWidth: 450,
          backgroundColor: getBackgroundColor(item.status),
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.03) translateY(-2px)',
          },
          minWidth: '250px',
          overflow: 'hidden',
          cursor: 'pointer',
          position: 'relative',
          fontFamily: 'Roboto, sans-serif',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            background:
              'linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.3))',
            zIndex: -1,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        }}
        onClick={handleOpenDetailModal}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: cyan[900],
                  fontSize: '1.3rem',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05rem',
                }}
              >
                {item.customer.name}
              </Typography>
              <Typography
                sx={{
                  color: grey[700],
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {t('dashboard.phone')}: {item.customer.phone}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              {' '}
              <Typography
                sx={{
                  color: cyan[900],
                  fontSize: '1rem',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {t('dashboard.licensePlate')}: {item.vehicle.licensePlate}
              </Typography>
              <Typography
                sx={{
                  color: grey[700],
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {t('customer.vehicleModel')}: {item.vehicle.model}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              color: grey[900],
              fontSize: '0.95rem',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {t('dashboard.services')}:{' '}
            {item.items.map((service: any) => service.serviceName).join(', ')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            gap: '0.5rem',
          }}
        >
          {(item.status === 'pending' || item.status === 'confirmed') && (
            <>
              {/* <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm();
                }}
                disabled={isLoading}
                sx={{
                  fontSize: '1rem',
                  flex: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {isLoading ? t('dashboard.confirming') : t('dashboard.confirm')}
              </Button> */}
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={isCancelling}
                sx={{
                  fontSize: '1rem',
                  flex: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {isCancelling
                  ? t('dashboard.cancelling')
                  : t('dashboard.cancel')}
              </Button>
            </>
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
              sx={{
                fontSize: '1.5rem',
                flex: 1,
                backgroundColor: '#007bb5',
                '&:hover': { backgroundColor: '#005a87' },
                transition: 'all 0.3s ease',
              }}
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
        refetch={refetch}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <PaymentModal
        open={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onSubmit={handlePaymentAndInvoice}
        invoiceAmount={totalPrice}
        appointmentId={item._id}
        customerName={item.customer.name}
        customerPhone={item.customer.phone}
        refetch={refetch}
        handlePaymentSuccess={handlePaymentSuccess}
      />

      <InvoiceDetailModal
        open={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        onBack={handleCloseInvoiceModal}
        invoiceData={selectedInvoice}
        refetch={refetch}
        isLoadingInvoice={isLoadingInvoice}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </>
  );
};

export default DraggableAppointment;
