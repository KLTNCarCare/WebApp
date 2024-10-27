import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useDeletePromotionLine } from 'src/api/promotionLine/useDeletePromotionLine';
import snackbarUtils from 'src/lib/snackbarUtils';

type DeletePromotionLineProps = {
  _id: string;
  refetch: () => void;
};

const DeletePromotionLine = ({ _id, refetch }: DeletePromotionLineProps) => {
  const { t } = useTranslation();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const { mutate: deletePromotionLine, isLoading } = useDeletePromotionLine({
    onSuccess: (success) => {
      setIsOpenDeleteDialog(false);
      refetch();
      snackbarUtils.success(success);
    },
    onError(error) {
      snackbarUtils.error(error);
    },
  });

  const handleDelete = () => {
    deletePromotionLine({ _id });
  };

  return (
    <>
      <DeleteIcon
        color="error"
        onClick={() => setIsOpenDeleteDialog(true)}
        style={{ cursor: 'pointer' }}
      />

      <Dialog
        open={isOpenDeleteDialog}
        maxWidth="xs"
        onClose={() => setIsOpenDeleteDialog(false)}
      >
        <DialogTitle variant="h4">{t('promotionLine.deleteTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            {t('dashboard.confirmDelete')}
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
            onClick={() => setIsOpenDeleteDialog(false)}
            variant="contained"
            color="inherit"
          >
            {t('dashboard.cancel')}
          </LoadingButton>
          <LoadingButton
            onClick={handleDelete}
            autoFocus
            color="error"
            variant="contained"
            loading={isLoading}
          >
            {t('dashboard.delete')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeletePromotionLine;
