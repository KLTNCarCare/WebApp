import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Avatar,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import {
  useForm,
  SubmitHandler,
  useWatch,
  useFieldArray,
} from 'react-hook-form';
import { useUpdateCustomer } from 'src/api/customer/useUpdateCustomer';
import { UpdateCustomerFn } from 'src/api/customer/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const schemaUpdateCustomer = yup.object({
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

type EditCustomerModalProps = {
  customerData: UpdateCustomerFn;
  refetch: () => void;
  setIsEditCustomer: (value: boolean) => void;
};

const EditCustomerModal = ({
  customerData,
  refetch,
  setIsEditCustomer,
}: EditCustomerModalProps) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm<UpdateCustomerFn>({
    resolver: yupResolver(schemaUpdateCustomer),
    defaultValues: customerData,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vehicles',
  });

  const watchedFields = useWatch({
    control,
  });

  useEffect(() => {
    setValue('name', customerData.name);
    setValue('phone', customerData.phone);
    setValue('email', customerData.email);
    setValue('dob', customerData.dob);
    setValue('vehicles', customerData.vehicles);
  }, [customerData, setValue]);

  useEffect(() => {
    setIsChanged(
      watchedFields.name !== customerData.name ||
        watchedFields.phone !== customerData.phone ||
        watchedFields.email !== customerData.email ||
        watchedFields.address !== customerData.address ||
        watchedFields.dob !== customerData.dob ||
        JSON.stringify(watchedFields.vehicles) !==
          JSON.stringify(customerData.vehicles)
    );
  }, [watchedFields, customerData]);

  const { mutate: updateCustomer } = useUpdateCustomer({
    onSuccess: () => {
      refetch();
      setIsSuccessDialogOpen(true);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
    },
  });

  const handleConfirmUpdate: SubmitHandler<UpdateCustomerFn> = (data) => {
    setIsLoading(true);
    updateCustomer({ id: customerData._id, data });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch();
    setIsEditCustomer(false);
  };

  const handleCloseModal = () => {
    setIsEditCustomer(false);
  };

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={true} onClose={handleCloseModal}>
        <DialogTitle>{t('customer.editCustomer')}</DialogTitle>
        <DialogContent>
          <form
            id="update-customer"
            onSubmit={handleSubmit(handleConfirmUpdate)}
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
                  disabled={!isValid || isLoading || !isChanged}
                >
                  {isLoading ? t('customer.updating') : t('customer.update')}
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
              {t('customer.updateDetailsTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('customer.updateSuccess')}</DialogContentText>
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

export default EditCustomerModal;
