import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateStaff } from 'src/api/staff/useCreateStaff';
import { CreateStaffFn } from 'src/api/staff/types';
import snackbarUtils from 'src/lib/snackbarUtils';

const schema = yup.object({
  name: yup.string().required('Vui lòng nhập tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  email: yup.string().email('Email không hợp lệ').nullable(),
  address: yup.string().nullable(),
  dob: yup.date().nullable(),
});

interface CreateStaffProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  setIsAddStaff?: (value: boolean) => void;
}

const CreateStaffModal: React.FC<CreateStaffProps> = ({
  open,
  onClose,
  refetch,
  setIsAddStaff,
}) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<CreateStaffFn>({
    defaultValues: {
      name: '',
      phone: '',
      email: null,
      address: null,
      dob: null,
    },
    resolver: yupResolver(schema),
  });

  const { mutate: createStaff, isLoading } = useCreateStaff({
    onSuccess: (success) => {
      if (refetch) refetch();
      setIsSuccessDialogOpen(true);
      snackbarUtils.success(success);
      reset();
      onClose();
    },
    onError: (error) => {
      snackbarUtils.error(error);
    },
  });

  const onSubmit: SubmitHandler<CreateStaffFn> = (data) => {
    createStaff(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">{t('staff.createStaffTitle')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="dense"
            label={t('staff.name')}
            type="text"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="dense"
            label={t('staff.phone')}
            type="text"
            fullWidth
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <TextField
            margin="dense"
            label={t('staff.email')}
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="dense"
            label={t('staff.address')}
            type="text"
            fullWidth
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          <TextField
            margin="dense"
            label={t('staff.dob')}
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...register('dob')}
            error={!!errors.dob}
            helperText={errors.dob?.message}
          />
          <DialogActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading || !isValid}
            >
              {t('staff.createStaff')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffModal;
