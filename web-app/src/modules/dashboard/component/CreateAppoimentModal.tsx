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
  Box,
  IconButton,
  Autocomplete,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useCreateAppointment } from 'src/api/appointment/useCreateAppoitmentInDay';
import { useGetCurrentServiceActive } from 'src/api/appointment/useGetAllServiceActive';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useDebounce from 'src/lib/hooks/useDebounce';

dayjs.extend(utc);
dayjs.extend(timezone);

const schemaCreateAppointment = yup.object({
  customer: yup.object({
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    name: yup.string().required('Vui lòng nhập tên khách hàng'),
  }),
  startTime: yup.date().required('Vui lòng nhập thời gian bắt đầu'),
  // .min(new Date(), 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại'),
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
  price: number;
  duration: number;
  categoryId: string;
  categoryName: string;
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
    watch,
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

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [selectedServices, setSelectedServices] = useState<Item[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { data: services = [], isLoading: loadingServices } =
    useGetCurrentServiceActive(
      open && debouncedSearchText ? debouncedSearchText : ''
    );

  const startTime = watch('startTime');
  const totalDuration = watch('total_duration');

  useEffect(() => {
    const totalDuration = fields.reduce(
      (acc, field) =>
        acc +
        (selectedServices.find((service) => service.itemId === field.itemId)
          ?.duration ?? 0),
      0
    );
    setValue('total_duration', totalDuration);
  }, [fields, selectedServices, setValue]);

  const handleServiceChange = (index: number, service: any) => {
    if (service) {
      update(index, {
        ...fields[index],
        itemId: service.itemId,
        itemName: service.itemName,
        serviceId: service.itemId,
        serviceName: service.itemName,
        typeId: service.categoryId,
        typeName: service.categoryName,
        price: service.price,
        duration: service.duration,
        categoryId: service.categoryId,
        categoryName: service.categoryName,
      });

      const updatedSelectedServices = [...selectedServices];
      updatedSelectedServices[index] = service;
      setSelectedServices(updatedSelectedServices);

      const totalDuration = updatedSelectedServices.reduce(
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
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Request failed with status code 400';
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    },
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
        price: item.price,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      })),
    };

    createAppointment(appointmentData);
  };

  const totalPrice = fields.reduce((acc, field) => acc + (field.price ?? 0), 0);
  const estimatedCompletionTime = startTime
    ? dayjs(startTime)
        .add(totalDuration ?? 0, 'hour')
        .format('YYYY-MM-DD HH:mm')
    : '';

  return (
    <Dialog maxWidth="lg" fullWidth open={open} onClose={onClose}>
      <DialogTitle sx={{ p: 2 }}>
        <Stack>
          <Typography variant="h4">{t('priceCatalog.addNew')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form
            id="create-appointment"
            onSubmit={handleSubmit(handleCreateAppointment)}
          >
            <Stack spacing={3} sx={{ paddingTop: '10px' }}>
              {/* Customer Info Section */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  {t('priceCatalog.customerInfo')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Vehicle Info Section */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  {t('priceCatalog.vehicleInfo')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Service Selection Section */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  {t('priceCatalog.serviceSelection')}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('priceCatalog.serviceName')}</TableCell>
                        <TableCell>{t('priceCatalog.servicePrice')}</TableCell>
                        <TableCell>{t('priceCatalog.duration')}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormControl fullWidth variant="filled">
                              <Controller
                                name={`items.${index}.itemId`}
                                control={control}
                                render={({ field: controllerField }) => (
                                  <Autocomplete
                                    options={services || []}
                                    getOptionLabel={(option) =>
                                      `${option.itemName}`
                                    }
                                    onChange={(event, value) => {
                                      controllerField.onChange(
                                        value?.itemId || ''
                                      );
                                      handleServiceChange(index, value);
                                    }}
                                    onInputChange={(event, value, reason) => {
                                      if (reason === 'input') {
                                        setSearchText(value);
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField {...params} variant="filled" />
                                    )}
                                    renderOption={(props, option) => (
                                      <Box component="li" {...props}>
                                        <Typography variant="body1">
                                          {option.itemName}
                                        </Typography>
                                        <Typography
                                          color="primary"
                                          sx={{ ml: 1 }}
                                        >
                                          - {t('priceCatalog.servicePrice')}:{' '}
                                          {option.price.toLocaleString()} VND
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="secondary"
                                          sx={{ ml: 1 }}
                                        >
                                          , {t('priceCatalog.duration')}:{' '}
                                          {option.duration}{' '}
                                          {t('priceCatalog.hours')}
                                        </Typography>
                                      </Box>
                                    )}
                                    value={
                                      selectedServices[index] ||
                                      services.find(
                                        (service) =>
                                          service.itemId ===
                                          controllerField.value
                                      ) ||
                                      null
                                    }
                                  />
                                )}
                              />
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            {field.price.toLocaleString()} VND
                          </TableCell>
                          <TableCell>
                            {field.duration} {t('priceCatalog.hours')}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                remove(index);
                                setSelectedServices((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              disabled={fields.length === 1}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => {
                      append({
                        id: uuidv4(),
                        itemId: '',
                        itemName: '',
                        serviceId: '',
                        serviceName: '',
                        typeId: '',
                        typeName: '',
                        price: 0,
                        duration: 0 as number,
                        categoryId: '',
                        categoryName: '',
                      });
                      setSelectedServices((prev) => [
                        ...prev,
                        {
                          id: uuidv4(),
                          itemId: '',
                          itemName: '',
                          serviceId: '',
                          serviceName: '',
                          typeId: '',
                          typeName: '',
                          price: 0,
                          duration: 0,
                          categoryId: '',
                          categoryName: '',
                        },
                      ]);
                    }}
                  >
                    {t('priceCatalog.addItem')}
                  </Button>
                  <Box textAlign={'right'}>
                    <Typography variant="h6" color="primary">
                      {t('priceCatalog.totalPrice')}:{' '}
                      {totalPrice.toLocaleString()} VND
                    </Typography>
                    <Divider sx={{ my: 0.3 }} />
                    <Typography variant="h6" color="primary">
                      {t('priceCatalog.totalDuration')}: {totalDuration}{' '}
                      {t('priceCatalog.hours')}
                    </Typography>
                    <Divider sx={{ my: 0.3 }} />
                    <Typography variant="h6" color="primary">
                      {t('priceCatalog.estimatedCompletionTime')}:{' '}
                      {estimatedCompletionTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Additional Details Section */}
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                            if (
                              date instanceof Date &&
                              !isNaN(date.getTime())
                            ) {
                              field.onChange(date.getTime());
                              setValue('startTime', date, {
                                shouldValidate: true,
                              });
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="filled"
                      label={t('priceCatalog.notes')}
                      type="text"
                      {...register('notes')}
                      inputProps={{ inputMode: 'text' }}
                      error={!!errors.notes}
                      helperText={
                        errors.notes ? String(errors.notes.message) : ''
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: 'white',
                  py: 2,
                  mt: 2,
                  zIndex: 1,
                }}
              >
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  type="submit"
                  disabled={!isValid}
                >
                  {t('priceCatalog.addNew')}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default CreateAppointmentModal;
