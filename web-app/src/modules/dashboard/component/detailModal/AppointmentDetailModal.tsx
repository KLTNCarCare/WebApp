import React, { useState } from 'react';
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
import { formatDateTime } from 'src/lib/ultils/formatDateTime';
import { DirectionsCar, ArrowForward } from '@mui/icons-material';
import PaymentModal from '../PaymentModal';

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

  const handlePaymentSubmit = (paymentMethod: string) => {
    refetch();
    setIsPaymentModalOpen(false);
    onClose();
  };

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
            width: 700,
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
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('priceCatalog.customerName')}:{' '}
                {item?.customer?.name || t('dashboard.na')}
              </Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.phone')}:{' '}
                {item?.customer?.phone || t('dashboard.na')}
              </Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.licensePlate')}:{' '}
                {item?.vehicle?.licensePlate || t('dashboard.na')}
              </Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.vehicleModel')}:{' '}
                {item?.vehicle?.model || t('dashboard.na')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.totalDuration')}: {item?.total_duration || 0}{' '}
                {t('dashboard.hours')}
              </Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.status')}: {t(`status.${item?.status}`)}
              </Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.createdAt')}: {formatDateTime(item?.createdAt)}
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 2,
              mb: 2,
              p: 2,
              bgcolor: 'background.default',
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}
            >
              {t('dashboard.process')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DirectionsCar sx={{ color: 'primary.main', mr: 1 }} />
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.startTime')}: {formatDateTime(item?.startTime)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ArrowForward sx={{ color: 'primary.main', mx: 1 }} />
              <Typography sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {t('dashboard.endTime')}: {formatDateTime(item?.endTime)}
              </Typography>
            </Box>
          </Box>

          {/* Dịch vụ */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('dashboard.services')}
          </Typography>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            {item?.items?.map((service: any, index: number) => (
              <Box
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography sx={{ color: 'text.primary' }}>
                  {service.serviceName}
                </Typography>
                <Typography sx={{ color: 'text.primary' }}>
                  {service.price?.toLocaleString() || 'N/A'} VND
                </Typography>
              </Box>
            ))}
          </Paper>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('dashboard.totalPrice')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {totalPrice.toLocaleString()} VND
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('dashboard.discount')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {discountAmount.toLocaleString()} VND
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('dashboard.finalPrice')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {finalPrice.toLocaleString()} VND
            </Typography>
          </Box>
          {item?.status === 'completed' && !item?.invoiceCreated && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPaymentModal}
              sx={{ mt: 3 }}
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
