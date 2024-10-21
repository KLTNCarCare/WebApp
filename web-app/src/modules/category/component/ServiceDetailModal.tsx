import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { ServiceByCategory } from 'src/api/category/useGetServiceByCategory';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  serviceData: ServiceByCategory | null;
  onSave: (
    updatedService: ServiceByCategory
  ) => Promise<{ code: number; message: string }>;
  mode: 'edit' | 'add';
  refetch: () => void;
}

const validationSchema = yup.object({
  serviceName: yup.string().required('Service name is required'),
  duration: yup.number().required('Duration is required'),
});

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  open,
  onClose,
  serviceData,
  onSave,
  mode,
  refetch,
}) => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<ServiceByCategory>({
    defaultValues: serviceData || {
      serviceName: '',
      duration: 0,
      description: '',
      status: 'inactive',
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (serviceData) {
      setValue('serviceName', serviceData.serviceName);
      setValue('duration', serviceData.duration);
      setValue('description', serviceData.description);
      setValue('status', serviceData.status);
    }
  }, [serviceData, setValue]);

  const handleSave: SubmitHandler<ServiceByCategory> = async (data) => {
    try {
      const response = await onSave(data);
      refetch();
      setSnackbarMessage(response.message);
      setSnackbarSeverity(response.code === 200 ? 'success' : 'error');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Có lỗi xảy ra');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === 'edit'
            ? t('category.editService')
            : t('category.addService')}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
            <TextField
              label={t('category.serviceName')}
              {...register('serviceName')}
              fullWidth
              margin="normal"
              error={!!errors.serviceName}
              helperText={errors.serviceName?.message}
            />
            <TextField
              label={t('category.duration')}
              {...register('duration')}
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: 0.5, step: 0.5 }}
              error={!!errors.duration}
              helperText={errors.duration?.message}
            />
            <TextField
              label={t('category.description')}
              {...register('description')}
              fullWidth
              margin="normal"
            />
            {mode === 'edit' && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === 'active'}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked ? 'active' : 'inactive'
                          )
                        }
                        color="primary"
                      />
                    }
                    label={
                      field.value === 'active'
                        ? t('category.active')
                        : t('category.inactive')
                    }
                  />
                )}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              {t('category.cancel')}
            </Button>
            <Button type="submit" color="primary" disabled={!isValid}>
              {t('category.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ServiceDetailModal;
