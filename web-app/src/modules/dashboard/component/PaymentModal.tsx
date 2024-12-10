import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useConfirmPayInvoice } from 'src/api/invoice/usePayInvoice';
import { usePayZaloPay } from 'src/api/payment/usePaymentZaloPay';
import { Invoice } from 'src/api/invoice/types';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (paymentMethod: string, invoiceDetails: any) => void;
  invoiceAmount: number;
  appointmentId: string;
  customerName: string;
  customerPhone: string;
  refetch: () => void;
  handlePaymentSuccess: (invoice: Invoice) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onSubmit,
  invoiceAmount,
  appointmentId,
  customerName,
  customerPhone,
  refetch,
  handlePaymentSuccess,
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { mutate: confirmPayInvoice, isLoading: isConfirming } =
    useConfirmPayInvoice({
      onSuccess: (response: any) => {
        const data: Invoice = response;
        toast.success(
          t('invoice.paymentConfirmation', {
            invoiceAmount,
            customerName,
            customerPhone,
          })
        );
        handlePaymentSuccess(data);
        onSubmit(paymentMethod, data);
        refetch();
      },
      onError: () => {
        toast.error(t('invoice.paymentFailed'));
      },
    });

  const { mutate: payZaloPay, isLoading: isPayingZaloPay } = usePayZaloPay({
    onSuccess: (url) => {
      window.open(url, '_blank');
      onClose();
      window.location.href = '/invoice';
    },
    onError: () => {
      toast.error(t('invoice.paymentFailed'));
    },
  });

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'zalopay') {
      payZaloPay({ appointmentId });
    } else {
      confirmPayInvoice({
        appointmentId,
        paymentMethod,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('invoice.selectPaymentMethod')}</DialogTitle>
      <DialogContent>
        <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label={
              <Typography
                variant="body1"
                style={{
                  fontWeight: paymentMethod === 'cash' ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: 8 }}>💵</span>
                {t('invoice.cash')}
              </Typography>
            }
          />
          <FormControlLabel
            value="zalopay"
            control={<Radio />}
            label={
              <Typography
                variant="body1"
                style={{
                  fontWeight: paymentMethod === 'zalopay' ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: 8 }}>💳</span>
                {t('invoice.zaloPay')}
              </Typography>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('invoice.cancel')}
        </Button>
        <Button
          onClick={handlePaymentSubmit}
          color="primary"
          variant="contained"
          disabled={isConfirming || isPayingZaloPay}
        >
          {isConfirming || isPayingZaloPay
            ? t('invoice.submiting')
            : t('invoice.submitPayment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
