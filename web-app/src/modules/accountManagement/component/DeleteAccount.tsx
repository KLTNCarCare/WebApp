import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useDeleteAccountByAdmin } from 'src/api/account/useDeleteAccount';
import { ReactComponent as CheckIcon } from '@/assets/icons/CheckCircle.svg';

type DeleteUserProps = {
  _id: string;
  refetch: () => void;
};
const DeleteAccount: React.FC<DeleteUserProps> = ({ _id, refetch }) => {
  const { t } = useTranslation();
  const [isOpenDeleteAccount, setIsOpenDeleteAccount] =
    useState<boolean>(false);
  const [isDeleteAccountSuccess, setIsDeleteAccountSuccess] =
    useState<boolean>(false);
  const { mutate: deleteAccount } = useDeleteAccountByAdmin({
    onSuccess: () => {
      setIsDeleteAccountSuccess(true);
    },
  });

  const handleDeleteAccount = () => {
    deleteAccount({ _id });
  };
  const handleCloseDeleteSuccess = () => {
    refetch();
    setIsOpenDeleteAccount(false);
    setIsDeleteAccountSuccess(false);
  };

  return (
    <>
      <DeleteIcon
        color="error"
        onClick={() => setIsOpenDeleteAccount(true)}
        style={{ cursor: 'pointer' }}
      />
      <Dialog
        open={isOpenDeleteAccount}
        maxWidth="xs"
        onClose={() => setIsOpenDeleteAccount(false)}
      >
        <DialogTitle variant="h4">{t('account.deleteAccount')} </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            {t('account.confirmDeleteAccount')}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 2,
            button: { width: '50%' },
          }}
        >
          <LoadingButton
            onClick={() => setIsOpenDeleteAccount(false)}
            variant="contained"
            color="inherit"
          >
            {t('account.cancel')}
          </LoadingButton>
          <LoadingButton
            onClick={handleDeleteAccount}
            autoFocus
            color="error"
            variant="contained"
          >
            {t('account.delete')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog
        sx={{
          '& .css-1v8har7-MuiPaper-root-MuiDialog-paper': {
            minWidth: '400px',
          },
        }}
        open={isDeleteAccountSuccess}
        onClose={() => setIsDeleteAccountSuccess(false)}
      >
        <DialogTitle sx={{ p: 2 }}>
          <Stack
            sx={{
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                marginBottom: 1.5,
                bgcolor: 'success.light',
              }}
            >
              <CheckIcon color="success" fontSize="large" />
            </Avatar>
            <Typography variant="h4">{t('account.deleteAccount')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {t('account.deleteAccountSuccess')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <LoadingButton
            fullWidth
            variant="contained"
            onClick={handleCloseDeleteSuccess}
          >
            {t('account.closeNotification')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccount;
