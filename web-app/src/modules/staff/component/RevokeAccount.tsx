import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Staff } from 'src/api/staff/types';
import { useRevokeAccount } from 'src/api/staff/useRevokeAccount';
import snackbarUtils from 'src/lib/snackbarUtils';

type RevokeAccountProps = {
  staff: Staff;
  open: boolean;
  onClose: () => void;
  refetch: () => void;
};

const RevokeAccount: React.FC<RevokeAccountProps> = ({
  staff,
  open,
  onClose,
  refetch,
}) => {
  const { t } = useTranslation();

  const { mutate: revokeAccount, isLoading } = useRevokeAccount({
    onSuccess: (success) => {
      snackbarUtils.success(success);
      refetch();
      onClose();
    },
    onError: (error) => {
      snackbarUtils.error(error);
    },
  });

  const handleConfirmRevoke = () => {
    revokeAccount(staff._id);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('staff.revokeAccountTitle')}</DialogTitle>
      <DialogContent>
        <Typography>{t('staff.revokeAccountConfirmation')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('dashboard.cancel')}
        </Button>
        <Button
          onClick={handleConfirmRevoke}
          color="secondary"
          disabled={isLoading}
        >
          {t('dashboard.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokeAccount;
