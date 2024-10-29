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

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (paymentMethod: string, invoiceDetails: any) => void;
  invoiceAmount: number;
  appointmentId: string;
  customerName: string;
  customerPhone: string;
  refetch: () => void;
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
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);

  const { mutate: confirmPayInvoice, isLoading: isConfirming } =
    useConfirmPayInvoice({
      onSuccess: (data) => {
        toast.success(
          t('invoice.paymentConfirmation', {
            invoiceAmount,
            customerName,
            customerPhone,
          })
        );
        setInvoiceDetails(data);
        onSubmit(paymentMethod, data);
        refetch();
        onClose();
      },
      onError: (error) => {
        toast.error(t('invoice.paymentFailed'));
      },
    });

  const { mutate: payZaloPay, isLoading: isPayingZaloPay } = usePayZaloPay({
    onSuccess: (url) => {
      window.open(url, '_blank');
      onClose();
    },
    onError: (error) => {
      toast.error(t('invoice.paymentFailed'));
    },
  });

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentSubmit = () => {
    console.log('Submitting payment', { appointmentId, paymentMethod });
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
            label={t('invoice.cash')}
          />
          <FormControlLabel
            value="zalopay"
            control={<Radio />}
            label={t('invoice.zaloPay')}
          />
          <FormControlLabel
            value="bank_transfer"
            control={<Radio />}
            label={t('invoice.bankTransfer')}
          />
        </RadioGroup>
        {invoiceDetails && (
          <div>
            <Typography variant="h6">{t('invoice.details')}</Typography>
            <Typography>
              {t('invoice.id')}: {invoiceDetails.id}
            </Typography>
            <Typography>
              {t('invoice.amount')}: {invoiceDetails.amount}
            </Typography>
            <Typography>
              {t('invoice.date')}: {invoiceDetails.date}
            </Typography>
            {/* Add more fields as necessary */}
          </div>
        )}
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
