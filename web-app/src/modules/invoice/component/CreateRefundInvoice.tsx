import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCreateRefundInvoice } from 'src/api/refundInvoice/useCreateRefundInvoice';
import snackbarUtils from 'src/lib/snackbarUtils';

interface CreateRefundInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  refetch: () => void;
  onSuccess: () => void;
}

const CreateRefundInvoice: React.FC<CreateRefundInvoiceModalProps> = ({
  open,
  onClose,
  invoiceId,
  refetch,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [refundReason, setRefundReason] = useState('');
  const { mutate: createRefundInvoice, isLoading: isCreatingRefund } =
    useCreateRefundInvoice({
      onSuccess: (success) => {
        setRefundReason('');
        onClose();
        refetch();
        onSuccess();
        snackbarUtils.success(success);
      },
      onError: (error) => {
        snackbarUtils.error(error);
      },
    });

  const handleRefund = () => {
    createRefundInvoice({ invoiceId, reason: refundReason });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('invoice.refundInvoice')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('invoice.refundReason')}
          fullWidth
          multiline
          rows={4}
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('dashboard.cancel')}
        </Button>
        <Button
          onClick={handleRefund}
          color="primary"
          disabled={isCreatingRefund}
        >
          {t('dashboard.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRefundInvoice;
