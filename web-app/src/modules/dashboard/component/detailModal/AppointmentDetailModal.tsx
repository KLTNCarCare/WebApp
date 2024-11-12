import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PaymentModal from '../PaymentModal';
import ServiceProgress from './ServiceProgress';
import { Item } from 'src/api/appointment/types';
import { useInProgressAppointment } from 'src/api/appointment/useUpdateServiceStatus';

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: any;
  refetch: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  open,
  onClose,
  item,
  refetch,
}) => {
  const { t } = useTranslation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const totalPrice =
    item?.items?.reduce(
      (total: number, service: any) => total + service.price,
      0
    ) || 0;
  const discountAmount = (totalPrice * (item?.discount?.per || 0)) / 100;
  const finalPrice = totalPrice - discountAmount;

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handlePaymentSubmit = (paymentMethod: string, invoiceDetails: any) => {
    refetch();
    setIsPaymentModalOpen(false);
    onClose();
  };

  const { mutate: updateServiceStatus } = useInProgressAppointment({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error updating service status:', error);
    },
  });

  const handleStatusChange = (
    serviceId: string,
    newStatus: 'pending' | 'in-progress' | 'completed'
  ) => {
    const updatedServices = item.items.map((service: Item) => {
      if (service.serviceId === serviceId) {
        return { ...service, status: newStatus };
      }
      return service;
    });

    const currentServiceIndex = updatedServices.findIndex(
      (service: Item) => service.serviceId === serviceId
    );
    if (
      newStatus === 'completed' &&
      currentServiceIndex < updatedServices.length - 1
    ) {
      updatedServices[currentServiceIndex + 1].status = 'in-progress';
    }

    const allServicesComplete = updatedServices.every(
      (service: Item) => service.status === 'completed'
    );
    if (allServicesComplete) {
      item.status = 'completed';
    }

    item.items = updatedServices;
    refetch();

    updateServiceStatus({ appointmentId: item._id, serviceId });
  };

  const formatDateTimeVN = (date: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  };

  useEffect(() => {
    console.log('isPaymentModalOpen:', isPaymentModalOpen);
  }, [isPaymentModalOpen]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="appointment-modal-title"
      aria-describedby="appointment-modal-description"
    >
      <Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 700,
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          <Typography
            id="appointment-modal-title"
            variant="h5"
            component="h2"
            sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
          >
            {t('dashboard.appointmentDetails')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.staffId')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.staff?.staffId || t('dashboard.na')}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.staffName')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.staff?.name || t('dashboard.na')}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('priceCatalog.customerName')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.customer?.name || t('dashboard.na')}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.phone')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.customer?.phone || t('dashboard.na')}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.licensePlate')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.vehicle?.licensePlate || t('dashboard.na')}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.vehicleModel')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.vehicle?.model || t('dashboard.na')}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.totalDuration')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {item?.total_duration || 0} {t('dashboard.hours')}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.status')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {t(`status.${item?.status}`)}
                </Typography>
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 'medium', mb: 1 }}
              >
                {t('dashboard.createdAt')}:{' '}
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {formatDateTimeVN(item?.createdAt)}
                </Typography>
              </Typography>
            </Grid>
          </Grid>

          <ServiceProgress item={item} onStatusChange={handleStatusChange} />

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('dashboard.totalPrice')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {totalPrice.toLocaleString('vi-VN')} VND
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('dashboard.discount')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {discountAmount.toLocaleString('vi-VN')} VND
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('dashboard.finalPrice')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {finalPrice.toLocaleString('vi-VN')} VND
            </Typography>
          </Box>
          {item?.status === 'completed' && !item?.invoiceCreated && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPaymentModal}
              sx={{
                mt: 3,
                position: 'sticky',
                bottom: 0,
                width: '100%',
                borderRadius: 0,
              }}
            >
              {t('dashboard.payAndCreateInvoice')}
            </Button>
          )}
        </Box>

        <PaymentModal
          open={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          onSubmit={handlePaymentSubmit}
          invoiceAmount={finalPrice}
          appointmentId={item?._id}
          customerName={item?.customer?.name}
          customerPhone={item?.customer?.phone}
          refetch={refetch}
        />
      </Box>
    </Modal>
  );
};

export default AppointmentDetailModal;
