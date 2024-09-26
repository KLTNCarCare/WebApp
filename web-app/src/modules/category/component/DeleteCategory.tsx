import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Avatar,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { useDeleteCategory } from 'src/api/category/useDeleteCategory';

type DeleteCategoryProps = {
  _id: string;
  refetch: () => void;
};

const DeleteCategory = ({ _id, refetch }: DeleteCategoryProps) => {
  const { t } = useTranslation();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const { mutate: deleteCategory, isLoading } = useDeleteCategory({
    onSuccess: () => {
      setIsOpenDeleteDialog(false);
      setIsSuccessDialogOpen(true);
    },
  });

  const handleDelete = () => {
    deleteCategory({ _id });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch();
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
        <DialogTitle variant="h4">{t('category.deleteTitle')}</DialogTitle>
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

      <Dialog
        maxWidth="xs"
        open={isSuccessDialogOpen}
        onClose={handleCloseSuccessDialog}
      >
        <DialogTitle sx={{ p: 2 }}>
          <Stack>
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
            <Typography variant="h4">
              {t('category.deleteSuccessTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('category.deleteSuccess')}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCloseSuccessDialog}
          >
            {t('report.closeNotification')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCategory;
