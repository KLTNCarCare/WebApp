import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Avatar,
  Typography,
  DialogContentText,
} from '@mui/material';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useCreateCustomer } from 'src/api/customer/useCreateCustomer';
import { CreateCustomerFn } from 'src/api/customer/types';
import AddIcon from '@mui/icons-material/Add';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import snackbarUtils from 'src/lib/snackbarUtils';

const schemaCreateCustomer = yup.object({
  name: yup.string().required('Vui lòng nhập tên khách hàng'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
  email: yup.string().nullable(),
  address: yup.string().nullable(),
  dob: yup.date().nullable(),
  vehicles: yup.array().of(
    yup.object({
      model: yup.string().required('Vui lòng nhập model xe'),
      licensePlate: yup.string().required('Vui lòng nhập biển số xe'),
    })
  ),
});

interface CreateCustomerProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  setIsAddCustomer?: (value: boolean) => void;
}

const CreateCustomerModal: React.FC<CreateCustomerProps> = ({
  open,
  onClose,
  refetch,
  setIsAddCustomer,
}) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<CreateCustomerFn>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      dob: null,
      vehicles: [{ model: '', licensePlate: '' }],
    },
    mode: 'onChange',
    resolver: yupResolver(schemaCreateCustomer),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vehicles',
  });

  const { mutate: createCustomer, isLoading: loadingCreateCustomer } =
    useCreateCustomer();

  const handleCreateCustomer: SubmitHandler<CreateCustomerFn> = (data) => {
    createCustomer(data, {
      onSuccess() {
        setIsSuccessDialogOpen(true);
      },
      onError(error) {
        const message =
          error.response?.data?.message || t('priceCatalog.createError');
        snackbarUtils.error(message);
      },
    });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch?.();
    setIsAddCustomer?.(false);
  };

  const handleCloseModal = () => {
    setIsAddCustomer?.(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{t('customer.addCustomer')}</DialogTitle>
        <DialogContent>
          <form
            id="create-customer"
            onSubmit={handleSubmit(handleCreateCustomer)}
          >
            <Stack spacing={2} sx={{ paddingTop: '10px' }}>
              <TextField
                required
                variant="filled"
                label={t('customer.customerName')}
                type="text"
                {...register('name')}
                inputProps={{ inputMode: 'text' }}
                error={!!errors.name}
                helperText={errors.name ? String(errors.name.message) : ''}
              />
              <TextField
                required
                variant="filled"
                label={t('customer.phone')}
                type="text"
                {...register('phone')}
                inputProps={{ inputMode: 'text' }}
                error={!!errors.phone}
                helperText={errors.phone ? String(errors.phone.message) : ''}
              />
              <TextField
                variant="filled"
                label={t('customer.email')}
                type="email"
                {...register('email')}
                inputProps={{ inputMode: 'email' }}
                error={!!errors.email}
                helperText={errors.email ? String(errors.email.message) : ''}
              />
              <TextField
                variant="filled"
                label={t('customer.dob')}
                type="date"
                {...register('dob')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dob}
                helperText={errors.dob ? String(errors.dob.message) : ''}
              />
              {/* Add fields for vehicles */}
              {fields.map((vehicle, index) => (
                <Stack
                  key={vehicle.id}
                  spacing={2}
                  direction="row"
                  alignItems="center"
                >
                  <TextField
                    required
                    variant="filled"
                    label={t('customer.vehicleModel')}
                    type="text"
                    {...register(`vehicles.${index}.model`)}
                    inputProps={{ inputMode: 'text' }}
                    error={!!errors.vehicles?.[index]?.model}
                    helperText={
                      errors.vehicles?.[index]?.model
                        ? String(errors.vehicles?.[index]?.model?.message)
                        : ''
                    }
                  />
                  <TextField
                    required
                    variant="filled"
                    label={t('customer.licensePlate')}
                    type="text"
                    {...register(`vehicles.${index}.licensePlate`)}
                    inputProps={{ inputMode: 'text' }}
                    error={!!errors.vehicles?.[index]?.licensePlate}
                    helperText={
                      errors.vehicles?.[index]?.licensePlate
                        ? String(
                            errors.vehicles?.[index]?.licensePlate?.message
                          )
                        : ''
                    }
                  />
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => append({ model: '', licensePlate: '' })}
              >
                {t('customer.addVehicle')}
              </Button>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={handleCloseModal}
                >
                  {t('dashboard.close')}
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  type="submit"
                  disabled={!isValid || loadingCreateCustomer}
                >
                  {loadingCreateCustomer
                    ? t('customer.creating')
                    : t('customer.create')}
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
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
              {t('customer.createDetailsTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('customer.createSuccess')}</DialogContentText>
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

export default CreateCustomerModal;
