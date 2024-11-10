import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Staff, UpdateStaffFn, UpdatePhoneStaffFn } from 'src/api/staff/types';
import { useUpdateStaff } from 'src/api/staff/useUpdateStaff';
import { useUpdatePhoneStaff } from 'src/api/staff/useUpdatePhone';
import snackbarUtils from 'src/lib/snackbarUtils';

type EditStaffProps = {
  open: boolean;
  onClose: () => void;
  staffData: Staff;
  refetch: () => void;
  setIsEditStaff: React.Dispatch<React.SetStateAction<boolean>>;
};

const schema = yup.object({
  name: yup.string().required('Vui lòng nhập tên'),
  email: yup.string().email('Email không hợp lệ').nullable(),
  address: yup.string().nullable(),
  dob: yup.date().nullable(),
});

const phoneSchema = yup.object({
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
});

const EditStaffModal: React.FC<EditStaffProps> = ({
  open,
  onClose,
  staffData,
  refetch,
  setIsEditStaff,
}) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateStaffFn>({
    resolver: yupResolver(schema),
  });

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
    reset: resetPhone,
  } = useForm<UpdatePhoneStaffFn>({
    resolver: yupResolver(phoneSchema),
  });

  useEffect(() => {
    if (staffData) {
      setValue('name', staffData.name);
      setValue('email', staffData.email);
      setValue('address', staffData.address);
      setValue(
        'dob',
        staffData.dob ? new Date(staffData.dob).toISOString().split('T')[0] : ''
      );
      resetPhone({ _id: staffData._id, phone: staffData.phone });
    }
  }, [staffData, setValue, resetPhone]);

  const { mutate: updateStaff, isLoading } = useUpdateStaff({
    onSuccess: (success) => {
      refetch();
      snackbarUtils.success(success);
      onClose();
      reset();
      setIsEditStaff(false);
    },
    onError: (error) => {
      snackbarUtils.error(error);
    },
  });

  const { mutate: updatePhone, isLoading: isLoadingPhone } =
    useUpdatePhoneStaff({
      onSuccess: (success) => {
        refetch();
        snackbarUtils.success(success);
        onClose();
        resetPhone();
        setIsEditStaff(false);
      },
      onError: (error) => {
        snackbarUtils.error(error);
      },
    });

  const onSubmit: SubmitHandler<UpdateStaffFn> = (data) => {
    updateStaff({ id: staffData._id, data });
  };

  const onSubmitPhone: SubmitHandler<UpdatePhoneStaffFn> = (data) => {
    updatePhone({ id: staffData._id, data });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">{t('staff.editStaffTitle')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label={t('staff.updateInfo')} />
          <Tab label={t('staff.updatePhone')} />
        </Tabs>
        <Box hidden={selectedTab !== 0}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="filled"
              label={t('staff.name')}
              type="text"
              {...register('name')}
              inputProps={{ inputMode: 'text' }}
              error={!!errors.name}
              helperText={errors.name ? String(errors.name.message) : ''}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              variant="filled"
              label={t('staff.email')}
              type="email"
              {...register('email')}
              inputProps={{ inputMode: 'email' }}
              error={!!errors.email}
              helperText={errors.email ? String(errors.email.message) : ''}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              variant="filled"
              label={t('staff.address')}
              type="text"
              {...register('address')}
              inputProps={{ inputMode: 'text' }}
              error={!!errors.address}
              helperText={errors.address ? String(errors.address.message) : ''}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              variant="filled"
              label={t('staff.dob')}
              type="date"
              {...register('dob')}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dob}
              helperText={errors.dob ? String(errors.dob.message) : ''}
              defaultValue={
                staffData.dob
                  ? new Date(staffData.dob).toISOString().split('T')[0]
                  : ''
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <DialogActions sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
              >
                {t('staff.updateStaff')}
              </Button>
            </DialogActions>
          </form>
        </Box>
        <Box hidden={selectedTab !== 1}>
          <form onSubmit={handleSubmitPhone(onSubmitPhone)}>
            <TextField
              variant="filled"
              label={t('staff.phone')}
              type="text"
              {...registerPhone('phone')}
              inputProps={{ inputMode: 'text' }}
              error={!!phoneErrors.phone}
              helperText={
                phoneErrors.phone ? String(phoneErrors.phone.message) : ''
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <DialogActions sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoadingPhone}
              >
                {t('staff.updatePhone')}
              </Button>
            </DialogActions>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffModal;
