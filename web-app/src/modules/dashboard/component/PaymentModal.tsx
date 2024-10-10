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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useConfirmPayInvoice } from 'src/api/invoice/usePayInvoice';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (paymentMethod: string) => void;
  invoiceAmount: number;
  invoiceId: string;
  customerName: string;
  customerPhone: string;
  refetch: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onSubmit,
  invoiceAmount,
  invoiceId,
  customerName,
  customerPhone,
  refetch,
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const { mutate: confirmPayInvoice, isLoading } = useConfirmPayInvoice({
    onSuccess: () => {
      toast.success(
        t('invoice.paymentConfirmation', {
          invoiceAmount,
          customerName,
          customerPhone,
        })
      );
      onSubmit(paymentMethod);
      refetch();
      onClose();
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
    if (paymentMethod === 'cash') {
      confirmPayInvoice({ invoiceId });
    } else {
      onSubmit(paymentMethod);
      onClose();
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
            value="credit"
            control={<Radio />}
            label={t('invoice.credit')}
          />
          <FormControlLabel
            value="bankTransfer"
            control={<Radio />}
            label={t('invoice.bankTransfer')}
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
          disabled={isLoading}
        >
          {isLoading ? t('invoice.submiting') : t('invoice.submitPayment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
