import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
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
import { useGrantAccount } from 'src/api/staff/useGrantAccount';
import { Staff } from 'src/api/staff/types';
import snackbarUtils from 'src/lib/snackbarUtils';

type GrantAccountProps = {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  staff: Staff | null;
};

const schema = yup.object({
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

type FormValues = {
  password: string;
};

const GrantAccount: React.FC<GrantAccountProps> = ({
  open,
  onClose,
  refetch,
  staff,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutate: updateStaff } = useGrantAccount({
    onSuccess: (success) => {
      refetch();
      setIsLoading(false);
      snackbarUtils.success(success);
      onClose();
      reset();
    },
    onError(error) {
      setIsLoading(false);
      snackbarUtils.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (staff) {
      setIsLoading(true);
      updateStaff({ id: staff._id, data: { password: data.password } });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">{t('staff.grantAccountTitle')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContentText>
            {t('staff.grantAccountDescription')}
          </DialogContentText>
          <TextField
            margin="dense"
            label={t('staff.name')}
            type="text"
            fullWidth
            value={staff?.name || ''}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label={t('staff.phone')}
            type="text"
            fullWidth
            value={staff?.phone || ''}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label={t('staff.password')}
            type="password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <DialogActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {t('staff.grantAccount')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GrantAccount;
