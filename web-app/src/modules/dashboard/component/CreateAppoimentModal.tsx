import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useCreateAppointment } from 'src/api/appointment/useCreateAppoitmentInDay';
import { useGetCurrentServiceActive } from 'src/api/appointment/useGetAllServiceActive';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const schemaCreateAppointment = yup.object({
  customer: yup.object({
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    name: yup.string().required('Vui lòng nhập tên khách hàng'),
  }),
  startTime: yup.date().required('Vui lòng nhập thời gian bắt đầu'),
});

type CreateAppointmentProps = {
  refetch?: () => void;
  setIsAddAppointment?: (value: boolean) => void;
  open: boolean;
  onClose: () => void;
};

type Item = {
  id: string;
  itemId: string;
  itemName: string;
  serviceId: string;
  serviceName: string;
  typeId: string;
  typeName: string;
  duration?: number;
};

function CreateAppointmentModal({
  refetch,
  setIsAddAppointment,
  open,
  onClose,
}: CreateAppointmentProps) {
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<{
    customer: { phone: string; name: string };
    vehicle: { licensePlate: string; model: string };
    startTime: Date | undefined;
    total_duration: number | undefined;
    notes: string;
    items: Item[];
  }>({
    defaultValues: {
      customer: { phone: '', name: '' },
      vehicle: { licensePlate: '', model: '' },
      startTime: undefined,
      total_duration: 0,
      notes: '',
      items: [],
    },
    mode: 'onChange',
    resolver: yupResolver(schemaCreateAppointment),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { data: services, isLoading: loadingServices } =
    useGetCurrentServiceActive();

  useEffect(() => {
    const totalDuration = fields.reduce(
      (acc, field) =>
        acc +
        (services?.find((service) => service.itemId === field.itemId)
          ?.duration ?? 0),
      0
    );
    setValue('total_duration', totalDuration);
  }, [fields, services, setValue]);

  const handleServiceChange = (index: number, serviceId: string) => {
    const selectedService = services?.find(
      (service) => service.itemId === serviceId
    );
    if (selectedService) {
      const updatedFields = [...fields];
      updatedFields[index] = {
        ...updatedFields[index],
        itemId: selectedService.itemId,
        itemName: selectedService.itemName,
        serviceId: selectedService.itemId,
        serviceName: selectedService.itemName,
        typeId: selectedService.categoryId,
        typeName: selectedService.categoryName,
        duration: selectedService.duration,
      };
      setValue('items', updatedFields);

      const totalDuration = updatedFields.reduce(
        (sum, field) => sum + (field.duration ?? 0),
        0
      );
      setValue('total_duration', totalDuration);
    }
  };

  const { mutate: createAppointment } = useCreateAppointment({
    onSuccess: () => {
      if (refetch) refetch();
      if (setIsAddAppointment) setIsAddAppointment(false);
      onClose();
    },
    onError: (error) => {},
  });

  const handleCreateAppointment: SubmitHandler<any> = (data) => {
    const appointmentData = {
      customer: data.customer,
      vehicle: data.vehicle,
      startTime: data.startTime,
      total_duration: data.total_duration,
      notes: data.notes,
      items: data.items.map((item: Item) => ({
        typeId: item.typeId,
        typeName: item.typeName,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
      })),
    };

    createAppointment(appointmentData);
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      <DialogTitle sx={{ p: 2 }}>
        <Stack>
          <Typography variant="h4">{t('priceCatalog.addNew')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <form
          id="create-appointment"
          onSubmit={handleSubmit(handleCreateAppointment)}
        >
          <Stack spacing={4} sx={{ paddingTop: '10px' }}>
            {/* Customer Info Section */}
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('priceCatalog.customerInfo')}
              </Typography>
              <Stack spacing={2}>
                <TextField
                  required
                  variant="filled"
                  label={t('priceCatalog.customerName')}
                  type="text"
                  {...register('customer.name')}
                  inputProps={{ inputMode: 'text' }}
                  error={!!errors.customer?.name}
                  helperText={
                    errors.customer?.name
                      ? String(errors.customer.name.message)
                      : ''
                  }
                />
                <TextField
                  required
                  variant="filled"
                  label={t('priceCatalog.customerPhone')}
                  type="text"
                  {...register('customer.phone')}
                  inputProps={{ inputMode: 'text' }}
                  error={!!errors.customer?.phone}
                  helperText={
                    errors.customer?.phone
                      ? String(errors.customer.phone.message)
                      : ''
                  }
                />
              </Stack>
            </Box>

            {/* Vehicle Info Section */}
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('priceCatalog.vehicleInfo')}
              </Typography>
              <Stack spacing={2}>
                <TextField
                  required
                  variant="filled"
                  label={t('priceCatalog.vehicleModel')}
                  type="text"
                  {...register('vehicle.model')}
                  inputProps={{ inputMode: 'text' }}
                  error={!!errors.vehicle?.model}
                  helperText={
                    errors.vehicle?.model
                      ? String(errors.vehicle.model.message)
                      : ''
                  }
                />
                <TextField
                  required
                  variant="filled"
                  label={t('priceCatalog.vehicleLicensePlate')}
                  type="text"
                  {...register('vehicle.licensePlate')}
                  inputProps={{ inputMode: 'text' }}
                  error={!!errors.vehicle?.licensePlate}
                  helperText={
                    errors.vehicle?.licensePlate
                      ? String(errors.vehicle.licensePlate.message)
                      : ''
                  }
                />
              </Stack>
            </Box>

            {/* Service Selection Section */}
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('priceCatalog.serviceSelection')}
              </Typography>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <FormControl fullWidth variant="filled" sx={{ mr: 2 }}>
                    <InputLabel>{t('priceCatalog.selectService')}</InputLabel>
                    <Controller
                      name={`items.${index}.itemId`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleServiceChange(index, e.target.value);
                          }}
                        >
                          {services?.map((service) => (
                            <MenuItem
                              key={service.itemId}
                              value={service.itemId}
                            >
                              {service.itemName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                  <IconButton
                    color="secondary"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  append({
                    id: uuidv4(),
                    itemId: '',
                    itemName: '',
                    serviceId: '',
                    serviceName: '',
                    typeId: '',
                    typeName: '',
                    duration: 0,
                  })
                }
              >
                {t('priceCatalog.addItem')}
              </Button>
            </Box>

            {/* Additional Details Section */}
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('priceCatalog.additionalDetails')}
              </Typography>
              <Stack spacing={2}>
                <Controller
                  name="startTime"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('priceCatalog.startDate')}
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startTime}
                      helperText={errors.startTime?.message}
                      fullWidth
                      variant="filled"
                      value={
                        field.value
                          ? dayjs(field.value).format('YYYY-MM-DDTHH:mm')
                          : ''
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (date instanceof Date && !isNaN(date.getTime())) {
                          field.onChange(date.getTime());
                          setValue('startTime', date, { shouldValidate: true });
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="total_duration"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('priceCatalog.totalDuration')}
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.total_duration}
                      helperText={errors.total_duration?.message}
                      fullWidth
                      variant="filled"
                      value={field.value}
                      disabled
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          field.onChange(value);
                          setValue('total_duration', value, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  )}
                />
                <TextField
                  required
                  variant="filled"
                  label={t('priceCatalog.notes')}
                  type="text"
                  {...register('notes')}
                  inputProps={{ inputMode: 'text' }}
                  error={!!errors.notes}
                  helperText={errors.notes ? String(errors.notes.message) : ''}
                />
              </Stack>
            </Box>

            <Button
              variant="contained"
              size="medium"
              fullWidth
              type="submit"
              disabled={!isValid}
            >
              {t('priceCatalog.addNew')}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAppointmentModal;
